import Navbar from "@/components/navbar/Navbar";
import { getNotifications } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const notifications = session?.user?.id ? await getNotifications() : [];

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        session={session}
        notifications={notifications ?? []}
      />
      {children}
    </div>
  );
};

export default HomeLayout;
