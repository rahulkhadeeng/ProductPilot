import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        ProductPilot keeps account, product, billing, and community data only
        for operating the platform.
      </p>

      <Card className="mt-8">
        <CardContent className="space-y-5 p-6 text-sm leading-6 text-muted-foreground">
          <p>
            We collect profile details from authentication providers, product
            submissions, comments, upvotes, notifications, and Stripe billing
            identifiers when you upgrade to Premium.
          </p>
          <p>
            Uploaded product media is stored through UploadThing. Payments and
            billing management are handled by Stripe; ProductPilot stores only
            the Stripe identifiers and subscription status needed to unlock
            Premium features.
          </p>
          <p>
            We do not sell personal data. Public product submissions, comments,
            and upvotes may be visible to other users as part of the community
            experience.
          </p>
          <p>
            For account or data questions, contact the project maintainer from
            the footer GitHub profile.
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
