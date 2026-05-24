import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, Lock, Activity, Server, Shield, Layout, Key, Database } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="min-h-screen selection:bg-nexus-red/30" style={{ background: "#090909", color: "#f5f4ef", fontFamily: "'Inter', sans-serif" }}>
      {/* NOISE TEXTURE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* ── NAVBAR ─────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between"
        style={{ background: "rgba(9, 9, 9, 0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid #151515" }}>
        <div className="flex items-center gap-3">
          <img src="favicon.ico" alt="Nexus" className="w-7"/>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Nexus
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#a3a3a3" }}>
          <a href="#features" className="hover:text-white transition-colors">Infrastructure</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <form action={async () => { "use server"; await signIn("google"); }}>
          <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-md transition-all hover:bg-white/5" style={{ color: "#f5f4ef", border: "1px solid #262626" }}>
            Authenticate
          </button>
        </form>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6 sm:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Left Copy */}
        <div className="flex-1 w-full max-w-2xl z-10 animate-fade-up">

          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold leading-[0.9] tracking-tighter mb-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Docs that <br />
            <span style={{ color: "#737373" }}>feel alive.</span>
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: "#a3a3a3", fontWeight: 400 }}>
            Shared workspaces, live cursors, granular permissions, and collaborative editing built for teams that move fast.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <form action={async () => { "use server"; await signIn("google"); }}>
              <button type="submit"
                className="px-6 py-3.5 rounded-md font-semibold text-sm transition-all group flex items-center gap-2 hover:opacity-90"
                style={{ background: "#f5f4ef", color: "#090909" }}>
                Initialize Workspace
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <a href="https://github.com/Shivansh08agr/Nexus" target="_blank" className="px-6 py-3.5 rounded-md font-semibold text-sm transition-all hover:bg-white/5"
              style={{ color: "#a3a3a3", border: "1px solid #262626" }}>
              Read the Docs
            </a>
          </div>
        </div>

        {/* Right UI Preview */}
        <div className="flex-1 w-full relative z-10 animate-fade-up" style={{ animationDelay: "150ms" }}>
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-nexus-red/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ background: "#111111", border: "1px solid #262626", boxShadow: "0 20px 80px rgba(0,0,0,0.6)" }}>
            {/* Window Controls */}
            <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: "#262626", background: "#090909" }}>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#262626" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#262626" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#262626" }} />
              </div>
              <div className="mx-auto text-[11px] font-mono text-neutral-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> nexus.dev/architecture
              </div>
            </div>
            
            {/* Editor Layout */}
            <div className="flex h-[400px] sm:h-[480px]">
              {/* Sidebar */}
              <div className="w-48 hidden sm:block p-4 border-r" style={{ borderColor: "#151515", background: "#090909" }}>
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-4">Workspace</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-300 p-1.5 rounded bg-white/5 border border-white/10">
                    <FileText className="w-3.5 h-3.5 text-nexus-red" /> System Architecture
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 p-1.5 hover:text-neutral-300 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Q3 Roadmap
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 p-1.5 hover:text-neutral-300 transition-colors">
                    <Database className="w-3.5 h-3.5" /> Schema Migrations
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 p-6 sm:p-10 relative bg-[#111111] overflow-hidden">
                {/* Avatars */}
                <div className="absolute top-6 right-6 flex items-center -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-nexus-gold border border-[#111] z-20 flex items-center justify-center text-[10px] font-bold text-black">A</div>
                  <div className="w-7 h-7 rounded-full bg-blue-500 border border-[#111] z-10 flex items-center justify-center text-[10px] font-bold text-white">S</div>
                </div>

                <h2 className="text-3xl font-bold mb-6 font-['Space_Grotesk'] text-[#f5f4ef]">V2 System Architecture</h2>
                
                <div className="space-y-5 text-sm text-[#a3a3a3] leading-relaxed relative font-['Inter']">
                  <p>We need to finalize the payload structure for the new synchronization engine. The current implementation uses WebSockets with Yjs.</p>
                  
                  {/* Code block */}
                  <div className="p-5 rounded-md font-mono text-xs my-6" style={{ background: "#090909", border: "1px solid #151515" }}>
                    <span style={{ color: "#E53935" }}>export const</span> updateDocument = <span style={{ color: "#D89B1D" }}>async</span> (id, data) =&gt; {'{'}
                    <br />&nbsp;&nbsp;<span style={{ color: "#D89B1D" }}>await</span> sync.broadcast(id, data);
                    <br />{'}'}
                  </div>

                  <p>
                    Let's make sure the latency is kept under 50ms for globally distributed teams.
                    <span className="relative inline-block ml-1 group">
                      <span className="animate-pulse absolute -left-1.5 -top-0.5 w-[2px] h-[1.2em] bg-blue-500" />
                      <span className="absolute -top-7 -left-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm rounded-bl-none whitespace-nowrap shadow-lg">Shivansh</span>
                    </span>
                  </p>

                  <ul className="list-disc pl-5 space-y-2 mt-4 text-[#737373]">
                    <li>WebSocket scaling via Redis Pub/Sub</li>
                    <li>Prisma connection pooling</li>
                    <li>
                      <span className="relative inline-block">
                        Client-side optimistic UI
                        <span className="animate-pulse absolute -right-2 top-0.5 w-[2px] h-[1.2em] bg-nexus-gold" />
                        <span className="absolute -top-6 -right-2 bg-nexus-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm rounded-br-none whitespace-nowrap shadow-lg">Adi</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS ───────────────────────────────────── */}
      <section className="py-12 border-y" style={{ borderColor: "#151515", background: "#0a0a0a" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale">
          <div className="text-[11px] font-mono uppercase tracking-widest">Powered by</div>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 font-['Space_Grotesk'] font-bold text-lg">
            <span>Next.js</span>
            <span>NestJS</span>
            <span>PostgreSQL</span>
            <span>Yjs</span>
            <span>Redis</span>
            <span>WebSockets</span>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ────────────────────── */}
      <section id="features" className="py-32 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Engineered for performance.</h2>
          <p className="text-neutral-400 max-w-xl text-lg">A technical foundation built to handle millions of real-time edits with granular access control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Live Sync */}
          <div className="md:col-span-2 p-10 rounded-xl relative overflow-hidden group" style={{ background: "#111111", border: "1px solid #262626" }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-red/5 blur-[80px] rounded-full group-hover:bg-nexus-red/10 transition-colors" />
            <Activity className="w-7 h-7 mb-6 text-nexus-red" />
            <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk'] text-[#f5f4ef]">CRDT-Powered Synchronization</h3>
            <p className="text-[#a3a3a3] max-w-md leading-relaxed">Conflict-free replicated data types ensure every keystroke is captured, merged, and distributed without data loss or locking.</p>
          </div>

          {/* Card 2: Security */}
          <div className="p-10 rounded-xl relative overflow-hidden group" style={{ background: "#111111", border: "1px solid #262626" }}>
            <Shield className="w-7 h-7 mb-6 text-neutral-300" />
            <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk'] text-[#f5f4ef]">Zero-Trust Auth</h3>
            <p className="text-[#a3a3a3] leading-relaxed">WebSockets authenticate via secure tokens. Read-only mode enforced server-side.</p>
          </div>

          {/* Card 3: Workspaces */}
          <div className="p-10 rounded-xl relative overflow-hidden group" style={{ background: "#111111", border: "1px solid #262626" }}>
            <Layout className="w-7 h-7 mb-6 text-neutral-300" />
            <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk'] text-[#f5f4ef]">Isolated Workspaces</h3>
            <p className="text-[#a3a3a3] leading-relaxed">Keep data siloed. Invite members to specific domains with RBAC roles.</p>
          </div>

          {/* Card 4: Architecture */}
          <div className="md:col-span-2 p-10 rounded-xl relative overflow-hidden group" style={{ background: "#111111", border: "1px solid #262626" }}>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-nexus-gold/5 blur-[80px] rounded-full group-hover:bg-nexus-gold/10 transition-colors" />
            <Server className="w-7 h-7 mb-6 text-nexus-gold" />
            <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk'] text-[#f5f4ef]">Stateless Edge Infrastructure</h3>
            <p className="text-[#a3a3a3] max-w-md leading-relaxed">Separation of concerns between Next.js edge functions and persistent WebSocket servers in NestJS.</p>
          </div>

        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section id="pricing" className="py-32 px-6 border-t relative overflow-hidden" style={{ borderColor: "#151515", background: "#090909" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-nexus-red/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 mx-auto bg-[#111111] border border-[#262626] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(229,57,53,0.15)]">
            <Key className="w-6 h-6 text-nexus-red" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Deploy your workspace.</h2>
          <p className="text-[#a3a3a3] mb-12 text-lg sm:text-xl">Start building with your team instantly. No credit card required.</p>
          
          <form action={async () => { "use server"; await signIn("google"); }}>
            <button type="submit" className="px-8 py-4 rounded-md font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 group"
              style={{ background: "#E53935", color: "#ffffff", boxShadow: "0 0 40px rgba(229,57,53,0.3)" }}>
              Authenticate via Google
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="py-12 px-6 sm:px-12 border-t" style={{ borderColor: "#151515", background: "#090909" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 rounded-sm flex items-center justify-center">
              <img src="favicon.ico"/>
            </div>
            <span className="font-bold tracking-tight text-sm text-neutral-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Nexus System</span>
          </div>
          
          <div className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-6">
            <span>v1.0.4</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> All systems operational</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <a href="https://github.com/Shivansh08agr/Nexus" className="hover:text-neutral-300 transition-colors">GitHub</a>
            <a href="https://github.com/Shivansh08agr/Nexus" className="hover:text-neutral-300 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}