import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Alex R.",
        role: "Freelance Designer",
        rating: 5,
        quote: "A spreadsheet was too messy, but HubSpot was way too loud. RB CRM hit the exact sweet spot for tracking my design client leads.",
    },
    {
        name: "Jordan K.",
        role: "Tech Consultant",
        rating: 5,
        quote: "I love the fixed pipeline. I didn't have to configure anything. I was logged in and tracking deals in under two minutes.",
    },
    {
        name: "Morgan S.",
        role: "Independent Copywriter",
        rating: 5,
        quote: "The free-tier contact cap was super honest. Under ten clients is free, and when I signed my eleventh, paying for Pro was a no-brainer.",
    },
] as const;

export function Testimonials() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-text-primary">
                    Loved by independent creators.
                </h2>
                <p className="max-w-2xl text-sm text-text-secondary">
                    Here is how modern freelancers track client relations with absolute calm.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((t) => (
                    <article
                        key={t.name}
                        className="rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between gap-4"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-1">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-accent text-accent"
                                    />
                                ))}
                            </div>
                            <p className="text-sm leading-6 text-text-secondary italic">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                        </div>

                        <div className="flex flex-col min-w-0 mt-2 border-t border-border pt-4">
                            <span className="text-sm font-semibold text-text-primary truncate">
                                {t.name}
                            </span>
                            <span className="text-xs text-text-secondary truncate">
                                {t.role}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
