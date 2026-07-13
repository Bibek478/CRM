import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";

type LoginPageProps = {
  searchParams?: {
    plan?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const selectedPlan = searchParams?.plan === "pro" ? "pro" : "starter";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <AuthCard
        title="Welcome back"
        description="Log in to open your dashboard and keep working where you left off."
        footer={
          <p>
            No account yet?{" "}
            <Link
              href={`/signup?plan=${selectedPlan}`}
              className="font-medium text-accent transition hover:text-accent-dark"
            >
              Sign up
            </Link>
          </p>
        }
      >
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </AuthCard>
    </main>
  );
}
