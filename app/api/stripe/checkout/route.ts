import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    // Validate required env vars upfront — fail fast with a clear log
    if (!process.env.STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID.startsWith("price_REPLACE")) {
        console.error("[api/stripe/checkout] STRIPE_PRO_PRICE_ID is missing or still a placeholder");
        return NextResponse.json(
            { success: false, error: "Billing is not configured yet." },
            { status: 500 },
        );
    }
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
        console.error("[api/stripe/checkout] NEXT_PUBLIC_SITE_URL is missing");
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }

    try {
        const supabase = await createSupabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("stripe_customer_id, email, plan")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            console.error("[api/stripe/checkout] profile fetch failed", profileError);
            return NextResponse.json(
                { success: false, error: "Failed to load profile" },
                { status: 500 },
            );
        }

        // Server-side Pro guard — never create a session for an already-subscribed user
        if (profile.plan === "pro") {
            return NextResponse.json(
                { success: false, error: "You are already on the Pro plan." },
                { status: 400 },
            );
        }

        // Service role client created inline — never at module scope
        // Used only to write stripe_customer_id (sanctioned exception per library-docs.md)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } },
        );

        let stripeCustomerId: string = profile.stripe_customer_id ?? "";

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? profile.email ?? undefined,
                metadata: { supabase_user_id: user.id },
            });
            stripeCustomerId = customer.id;

            const { error: saveError } = await supabaseAdmin
                .from("profiles")
                .update({ stripe_customer_id: stripeCustomerId })
                .eq("id", user.id);

            if (saveError) {
                // Customer created in Stripe but not saved locally — log with customer ID
                // so it can be manually reconciled if needed
                console.error(
                    "[api/stripe/checkout] stripe_customer_id save failed — orphaned Stripe customer:",
                    stripeCustomerId,
                    saveError,
                );
                return NextResponse.json(
                    { success: false, error: "Internal server error" },
                    { status: 500 },
                );
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: stripeCustomerId,
            client_reference_id: user.id,
            line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?checkout=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?checkout=cancelled`,
        });

        return NextResponse.json({ success: true, url: session.url });
    } catch (error) {
        console.error("[api/stripe/checkout]", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
