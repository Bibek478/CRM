import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";

type SignupPageProps = {
  searchParams?: {
    plan?: string;
  };
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  const selectedPlan = searchParams?.plan === "pro" ? "pro" : "starter";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <AuthCard
        title="Start free"
        description="Create your RB CRM account with email and password or continue with Google. Pick a plan on the pricing table first, then use the matching signup path here."
        footer={
          <p>
            Already have an account?{" "}
            <Link
              href={`/login?plan=${selectedPlan}`}
              className="font-medium text-accent transition hover:text-accent-dark"
            >
              Log in
            </Link>
          </p>
        }
      >
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </AuthCard>
    </main>
  );
}
