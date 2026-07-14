import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("[api/stripe/webhook] signature verification failed", err);
        return new Response("Invalid signature", { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.client_reference_id;
                if (!userId) break;

                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );

                await supabaseAdmin
                    .from("profiles")
                    .update({
                        plan: "pro",
                        stripe_subscription_id: subscription.id,
                        subscription_status: "active",
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq("id", userId);
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await supabaseAdmin
                    .from("profiles")
                    .update({
                        subscription_status: subscription.cancel_at_period_end ? "canceling" : "active",
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq("stripe_subscription_id", subscription.id);
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await supabaseAdmin
                    .from("profiles")
                    .update({ plan: "free", subscription_status: "canceled" })
                    .eq("stripe_subscription_id", subscription.id);
                break;
            }
        }
    } catch (err) {
        console.error("[api/stripe/webhook] error processing event", err);
        return new Response("Webhook process error", { status: 500 });
    }

    return new Response(null, { status: 200 });
}
