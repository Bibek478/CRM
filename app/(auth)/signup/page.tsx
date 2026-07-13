import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <AuthCard
        title="Start free"
        description="Create your RB CRM account with email and password or continue with Google."
        footer={
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-accent transition hover:text-accent-dark"
            >
              Log in
            </Link>
          </p>
        }
      >
        <AuthForm mode="signup" />
      </AuthCard>
    </main>
  );
}
