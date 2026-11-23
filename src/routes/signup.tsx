import { createFileRoute } from "@tanstack/react-router";
import { SignupWizard } from "@/components/signup-wizard";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — CODDZ" }] }),
});

function SignupPage() {
  return <SignupWizard />;
}