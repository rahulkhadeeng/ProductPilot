import Navbar from "@/components/navbar/Navbar";
import { getNotifications, getProductsByUserId } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const [notifications, products] = session?.user?.id
    ? await Promise.all([
        getNotifications(),
        getProductsByUserId(session.user.id),
      ])
    : [[], []];

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        session={session}
        notifications={notifications ?? []}
        products={products}
      />
      {children}
    </div>
  );
};

export default HomeLayout;
