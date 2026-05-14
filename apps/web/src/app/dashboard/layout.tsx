import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <div className="flex min-h-screen" style={{ background: "#0f0f0f" }}>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
