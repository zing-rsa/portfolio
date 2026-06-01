import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAllProjects } from "@/lib/db/queries";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const projects = await getAllProjects();

  return (
    <AdminDashboard initialProjects={projects} adminEmail={session.sub} />
  );
}
