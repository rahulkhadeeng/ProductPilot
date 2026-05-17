import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth/auth";
import { getNotifications, getProductsByUserId } from "@/lib/actions";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  const notifications = await getNotifications();
  const products = await getProductsByUserId(session?.user?.id || "");

  return (
    <div className="flex min-h-full flex-col">
      <Navbar 
        session={session} 
        notifications={notifications}
        products={products}
      />
      {children}
    </div>
  );
};

export default HomeLayout;
