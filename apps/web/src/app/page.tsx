import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, Users, Lock, Zap, Globe, Shield } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f", color: "#f0ede6" }}>
      {/* ── NAVBAR ─────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1e1e" }}>
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="Nexus Logo" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Nexus
          </span>
        </div>

        <form action={async () => { "use server"; await signIn("google"); }}>
          <button type="submit" className="btn-primary" style={{ cursor: "pointer" }}>
            Sign in with Google
          </button>
        </form>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="pt-40 pb-24 px-6 text-center max-w-4xl mx-auto animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: "#1a0a0a", color: "#f87171", border: "1px solid #7f1d1d" }}>
          <Zap className="w-3 h-3" /> Real-time multiplayer document editing
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold leading-none mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}>
          Your team's{" "}
          <span className="text-gradient-gold">collaborative</span>
          <br />workspace
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: "#9ca3af" }}>
          Nexus combines real-time collaboration, role-based access control, and a powerful editor
          — so your team can write, think, and build together.
        </p>

        <form action={async () => { "use server"; await signIn("google"); }}>
          <button type="submit"
            className="animate-pulse-gold"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#fff",
              border: "none",
              padding: "1rem 2.5rem",
              borderRadius: "0.625rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064 5.96 5.96 0 0 1 4.123 1.632l2.884-2.884A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
            </svg>
            Get started with Google — it's free
          </button>
        </form>

        <p className="mt-4 text-sm" style={{ color: "#4b5563" }}>No credit card required.</p>
      </section>

      {/* ── FEATURE GRID ───────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest mb-12"
          style={{ color: "#d97706" }}>Everything your team needs</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              color: "#d97706",
              title: "Real-Time Collaboration",
              desc: "See your teammates' cursors and edits as they happen — no refresh required. Powered by Yjs & Hocuspocus.",
            },
            {
              icon: Lock,
              color: "#dc2626",
              title: "Role-Based Access",
              desc: "Owners, Admins, Editors, and Viewers. Invite with email. Permissions enforced at the WebSocket level.",
            },
            {
              icon: FileText,
              color: "#8b5cf6",
              title: "Rich Document Editor",
              desc: "Headings, task lists, code blocks, blockquotes, bold, italic and more — all in a beautiful Notion-like editor.",
            },
            {
              icon: Users,
              color: "#10b981",
              title: "Team Management",
              desc: "Manage every member from a dedicated dashboard. Promote, demote, or remove with one click.",
            },
            {
              icon: Globe,
              color: "#3b82f6",
              title: "Email Invitations",
              desc: "Invite anyone by email. They'll receive a link and can join instantly when they sign in with Google.",
            },
            {
              icon: Shield,
              color: "#f59e0b",
              title: "Secure by Default",
              desc: "End-to-end access control. Read-only mode is enforced at the server level — not just the UI.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="nexus-card p-6 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}33` }}>
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA FOOTER STRIP ───────────────────────── */}
      <section className="py-20 px-6 text-center" style={{ background: "#111", borderTop: "1px solid #1e1e1e" }}>
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Ready to build together?
        </h2>
        <p className="text-lg mb-8" style={{ color: "#6b7280" }}>
          Sign in and create your first workspace in seconds.
        </p>
        <form action={async () => { "use server"; await signIn("google"); }}>
          <button type="submit" className="btn-gold" style={{ fontSize: "1rem", padding: "0.875rem 2rem", cursor: "pointer" }}>
            Start for free →
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs" style={{ color: "#374151", borderTop: "1px solid #1a1a1a" }}>
        © {new Date().getFullYear()} Nexus. Built with Next.js, NestJS & Tiptap.
      </footer>
    </div>
  );
}