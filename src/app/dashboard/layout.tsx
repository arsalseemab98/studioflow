import { Sidebar } from "@/components/layout/sidebar";
import { FreelancerSidebar } from "@/components/layout/freelancer-sidebar";
import { Header } from "@/components/layout/header";
import { getUser } from "@/lib/supabase/get-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUser();
  const isFreelancer = userData?.isFreelancer;

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      {isFreelancer ? <FreelancerSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
