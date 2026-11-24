import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute } from "@tanstack/react-router";
import { SignupWizard } from "@/components/signup-wizard";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: `Sign up — ${BRAND_NAME}` }] }),
});

function SignupPage() {
  return <SignupWizard />;
}