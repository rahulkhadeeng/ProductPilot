import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <NewProductForm />;
}
