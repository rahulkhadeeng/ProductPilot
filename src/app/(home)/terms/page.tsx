import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Terms & Conditions</h1>
      <p className="mt-4 text-muted-foreground">
        These terms describe the expected use of ProductPilot as a product
        launch and community platform.
      </p>

      <Card className="mt-8">
        <CardContent className="space-y-5 p-6 text-sm leading-6 text-muted-foreground">
          <p>
            Users are responsible for the products, links, images, comments, and
            other content they submit. Submissions may be reviewed, approved, or
            rejected by administrators.
          </p>
          <p>
            Premium membership unlocks unlimited product submissions and related
            creator benefits. Billing, invoices, payment methods, and
            cancellation flows are managed securely through Stripe.
          </p>
          <p>
            Do not submit misleading, harmful, infringing, or abusive content.
            ProductPilot may remove content or restrict accounts that violate
            the community purpose of the platform.
          </p>
          <p>
            ProductPilot is provided as a project platform and may evolve over
            time as features, moderation workflows, and deployment environments
            are improved.
          </p>
        </CardContent>
      </Card>

      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Back to ProductPilot
      </Link>
    </main>
  );
}
