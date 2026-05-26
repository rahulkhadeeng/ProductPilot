import { redirect } from "next/navigation";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import NotificationsList from "@/components/NotificationsList";
import UserDashboardNav from "@/components/UserDashboardNav";
import { getNotifications } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const notifications = await getNotifications();

  return (
    <AnimateContainer>
      <main className="site-container-narrow py-8 transition-all">
        <UserDashboardNav />
        <NotificationsList notifications={notifications ?? []} />
      </main>
    </AnimateContainer>
  );
}
