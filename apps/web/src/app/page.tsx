import { getServerSession } from "@/lib/server-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  redirect("/sign-in");
}
