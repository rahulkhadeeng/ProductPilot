import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar session={session} />
      {children}
    </div>
  );
};

export default HomeLayout;
