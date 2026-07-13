"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

type AuthMode = "login" | "signup";
type SignupPlan = "starter" | "pro";

type Props = {
  mode: AuthMode;
};

type PendingAction = "credentials" | "google" | "recovery" | null;

const inputClassName =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent";

const labelClassName = "text-sm font-medium text-text-primary";
const fieldClassName = "flex flex-col gap-2";

const getAuthErrorMessage = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email or password incorrect.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirm your email, then try logging in again.";
  }

  if (normalizedMessage.includes("user already registered")) {
    return "Account already exists. Try logging in instead.";
  }

  if (normalizedMessage.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }

  return "Authentication failed. Try again.";
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const selectedPlan: SignupPlan = searchParams.get("plan") === "pro" ? "pro" : "starter";
  const selectedPlanLabel = selectedPlan === "pro" ? "Pro" : "Starter";
  const isPending = pendingAction !== null;

  const handleCredentialsSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPendingAction("credentials");

    try {
      const result = isLogin
        ? await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          })
        : await supabase.auth.signUp({
            email: trimmedEmail,
            password,
          });

      if (result.error) {
        setError(getAuthErrorMessage(result.error.message));
        return;
      }

      if (!isLogin && !result.data.session) {
        setMessage(
          selectedPlan === "pro"
            ? "Account created. Check your email, then log in with Pro selected to continue to billing."
            : "Account created. Check your email, then log in.",
        );
        return;
      }

      const nextPath = selectedPlan === "pro" ? "/billing?plan=pro" : "/dashboard";

      router.replace(nextPath);
      router.refresh();
    } catch (submitError) {
      console.error("[components/auth/AuthForm]", submitError);
      setError("Authentication failed. Try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setMessage(null);
    setPendingAction("google");

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });

      if (oauthError) {
        setError("Google sign-in could not start. Try again.");
        setPendingAction(null);
      }
    } catch (oauthError) {
      console.error("[components/auth/AuthForm]", oauthError);
      setError("Google sign-in could not start. Try again.");
      setPendingAction(null);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email first, then request a reset link.");
      return;
    }

    setPendingAction("recovery");

    try {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/login`,
        },
      );

      if (recoveryError) {
        setError("Password reset email could not be sent.");
        return;
      }

      setMessage("Password reset email sent.");
    } catch (recoveryError) {
      console.error("[components/auth/AuthForm]", recoveryError);
      setError("Password reset email could not be sent.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isLogin ? (
        <div className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-secondary">
          Selected plan: <span className="font-medium text-text-primary">{selectedPlanLabel}</span>
        </div>
      ) : null}

      <form className="flex flex-col gap-4" onSubmit={handleCredentialsSubmit}>
        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor={`${mode}-email`}>
            Email<span className="text-error"> *</span>
          </label>
          <input
            id={`${mode}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className={fieldClassName}>
          <div className="flex items-center justify-between gap-3">
            <label className={labelClassName} htmlFor={`${mode}-password`}>
              Password<span className="text-error"> *</span>
            </label>
            {isLogin ? (
              <button
                type="button"
                className="text-xs font-medium text-accent transition hover:text-accent-dark"
                onClick={handlePasswordReset}
                disabled={isPending}
              >
                Forgot password?
              </button>
            ) : null}
          </div>
          <input
            id={`${mode}-password`}
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputClassName}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="text-xs text-success" role="status">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        >
          {pendingAction === "credentials"
            ? isLogin
              ? "Logging in..."
              : "Creating account..."
            : isLogin
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-70"
        onClick={handleGoogleAuth}
        disabled={isPending}
      >
        {pendingAction === "google"
          ? "Connecting to Google..."
          : isLogin
            ? "Log in with Google"
            : "Sign up with Google"}
      </button>
    </div>
  );
}
