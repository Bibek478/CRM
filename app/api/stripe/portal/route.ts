import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST() {
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
            .select("stripe_customer_id")
            .eq("id", user.id)
            .single();

        if (profileError || !profile?.stripe_customer_id) {
            return NextResponse.json(
                { success: false, error: "No billing account found." },
                { status: 400 },
            );
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
        });

        return NextResponse.json({ success: true, url: session.url });
    } catch (error) {
        console.error("[api/stripe/portal]", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
