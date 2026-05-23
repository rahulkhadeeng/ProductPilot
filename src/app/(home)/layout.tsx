import Navbar from "@/components/navbar/Navbar";
import { getNavbarData } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const navbarData = session?.user
    ? await getNavbarData({
        userId: session.user.id,
        email: session.user.email,
      })
    : {
        isAdmin: false,
        notifications: [],
      };

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        session={session}
        notifications={navbarData.notifications}
        isAdmin={navbarData.isAdmin}
      />
      {children}
    </div>
  );
};

export default HomeLayout;
