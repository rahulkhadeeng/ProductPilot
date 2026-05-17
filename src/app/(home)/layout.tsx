import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  // In the future, we will fetch notifications and products here and pass to Navbar
  // as done in the reference repo.

  return (
    <div className="flex min-h-full flex-col">
      <Navbar session={session} />
      {children}
    </div>
  );
};

export default HomeLayout;
