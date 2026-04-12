import { useState, useEffect } from "react";
import { PageMeta } from "@/components/PageMeta";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionLabel } from "@/components/ui/section-label";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Video, Zap, Eye, Rocket, CheckCircle2, Linkedin, ArrowRight, Users } from "lucide-react";

/* ── Countdown Timer ─────────────────────────────────────── */
function CountdownTimer() {
  const target = new Date("2026-03-28T10:45:00+05:30").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      {[{ v: d, l: "Days" }, { v: h, l: "Hours" }, { v: m, l: "Min" }, { v: s, l: "Sec" }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 min-w-[56px]">
            <span className="font-mono text-2xl font-bold text-primary">{String(v).padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Zoom Registration Embed ───────────────────────────────── */
const MEETING_PAGE_URL = "/webinar/meeting";

/* ── Animated Section wrapper ───────────────────────────────── */
function ScrollSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={cn("scroll-animate", isVisible && "visible", className)}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

/* ── Data ────────────────────────────────────────────────────── */
const whatYoullSee = [
  { icon: Zap, title: "Blank Screen → Deployed App in 60 Minutes", desc: "Jerry will build a complete application live using Claude Code — from project setup to deployment. No pre-written code. No shortcuts. You'll see every step." },
  { icon: Eye, title: "Build Along on Your Own Machine", desc: "This isn't a sit-and-watch session. Follow along step-by-step and build the same app on your machine. Walk away with a real project you built yourself." },
  { icon: Rocket, title: "See Why Senior Devs Are Switching to AI Tools", desc: "Your experience with architecture, APIs, and system design makes you the perfect candidate for AI-powered development. See how Claude Code amplifies the skills you already have." },
];

const thisIsForYou = [
  "You're a Java or Spring Boot developer with 8+ years of experience",
  "You've been hearing about AI agents replacing developers — and want to see the reality yourself",
  "You want to understand how agentic AI systems like Claude Code actually build software end-to-end",
  "You're exploring a transition into AI/ML roles but don't know where your existing skills fit",
  "You're tired of surface-level AI demos — you want to see real architecture, real code, real deployment",
];

/* ── Page ────────────────────────────────────────────────────── */
export default function Webinar() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | Live Workshop: Build a Full App in 60 Min with Claude Code"
        description="Senior Java Devs: watch Jerry Kurian build a complete app live using Claude Code. Follow along on your machine. Free live workshop on Zoom."
      />
      {/* Sumo bar */}
      <a
        href="#register"
        onClick={() => trackEvent("cta_click", { cta_label: "sumo_bar", cta_section: "sumo_bar", page_path: "/webinar" })}
        className="block w-full bg-primary text-primary-foreground py-2.5 px-4 text-center cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <p className="text-sm sm:text-base font-semibold">
          🔥 Senior Java Devs | Build a Full App with Claude Code in 60 Min → Claim Your Seat
        </p>
      </a>

      {/* Hero */}
      <section className="px-4 pt-10 pb-8 bg-hero-pattern">
        <div className="container max-w-4xl text-center">
          {/* Value anchor pill */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="highlight-pill text-sm font-semibold tracking-widest uppercase">
              Live on Zoom
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Senior Java Devs:{" "}
            <span className="text-primary">Build a Full App in 60 Min with Claude Code</span>
          </h1>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              150+ senior devs mentored
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold text-orange-400">Almost Full!</span> Limited to 200 seats
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-5">
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Calendar className="w-5 h-5 text-primary" /> March 28th</span>
            <span className="text-border text-xl">|</span>
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Clock className="w-5 h-5 text-primary" /> Saturday, 10:45 AM IST</span>
            <span className="text-border text-xl">|</span>
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Video className="w-5 h-5 text-primary" /> Live on Zoom</span>
          </div>

          <p className="mt-4 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Jerry Kurian, founder of GenAI People, will live-build an end-to-end application using Claude Code —{" "}
            <span className="text-foreground font-medium">from blank screen to deployed app. Follow along and build yours too.</span>
          </p>

          {/* Countdown */}
          <CountdownTimer />

          <a
            href={MEETING_PAGE_URL}
            onClick={() => trackEvent("cta_click", { cta_label: "register_zoom", cta_section: "hero", page_path: "/webinar" })}
            className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            🎯 Register FREE — Only a Few Seats Left <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-muted-foreground/60 text-xs mt-2">100% Free. No credit card. No catch.</p>
        </div>
      </section>

      {/* Agitation */}
      <ScrollSection className="py-6 px-4 bg-section-alt">
        <div className="container max-w-3xl text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The world changed. Most senior devs are still catching up.
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Junior developers are shipping full-stack apps in hours using AI tools. Meanwhile, experienced engineers — the ones with 10+ years of Java, microservices, and system design — are watching from the sidelines. Not because they lack skill. Because no one showed them how their skills apply to this new world. <span className="text-foreground font-medium">This session changes that.</span>
          </p>
        </div>
      </ScrollSection>

      {/* What You'll See */}
      <ScrollSection className="py-6 px-4">
        <div className="container max-w-5xl">
          <SectionLabel>What You'll See</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Not a demo. A real build session.
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg text-xl">
            Watch Jerry build it. Then build it yourself — live, alongside him.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {whatYoullSee.map((item, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* This Is For You If */}
      <ScrollSection className="py-6 px-4 bg-section-alt">
        <div className="container max-w-3xl">
          <SectionLabel>Is This For You?</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            This Is For You If…
          </h2>

          <div className="space-y-3">
            {thisIsForYou.map((item, i) => (
              <div key={i} className="glass-card flex items-start gap-4 p-5">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* About the Presenter */}
      <ScrollSection className="py-6 px-4">
        <div className="container max-w-5xl">
          <SectionLabel>Your Host</SectionLabel>

          <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src="/jerry-kurian.jpeg"
              alt="Jerry Kurian"
              className="w-36 h-36 rounded-2xl object-cover flex-shrink-0 border-2 border-primary/20"
            />
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">Jerry Kurian</h3>
              <p className="text-primary text-sm font-medium mb-4">Founder &amp; Chief Mentor, GenAI People</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                25+ years in tech. Previously Director of Engineering at an AI company. Jerry uses Claude Code daily to build real products and has mentored 150+ senior developers into AI roles at companies like Target, Oracle, Infosys, and Verizon. In this session, he'll build a complete app from scratch — live — so you can see exactly how it's done.
              </p>
              <a
                href="https://www.linkedin.com/in/jerryk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" /> Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* What You Get FREE — Value Stack */}
      <ScrollSection className="py-6 px-4">
        <div className="container max-w-3xl">
          <SectionLabel>What You Get</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Everything You Get — <span className="text-green-400">100% FREE</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6"><span className="text-green-400 font-bold">100% FREE for senior developers</span></p>
          <div className="space-y-3">
            {[
              { text: "60-min live build session — watch a full app get built from scratch", value: "₹999" },
              { text: "Build along on your own machine — walk away with a real project", value: "₹499" },
              { text: "Full recording to rewatch and reference anytime", value: "₹299" },
              { text: "Understanding of how your Java skills translate to AI development", value: "₹199" },
              { text: "Confidence that you can build with AI tools — not just watch demos", value: "Priceless" },
            ].map((item, i) => (
              <div key={i} className="glass-card flex items-start gap-4 p-5">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <p className="text-foreground text-lg">{item.text}</p>
                  <span className="text-muted-foreground/60 text-sm font-mono whitespace-nowrap line-through">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={MEETING_PAGE_URL}
              onClick={() => trackEvent("cta_click", { cta_label: "register_zoom", cta_section: "value_stack", page_path: "/webinar" })}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors"
            >
              🎁 Get It All FREE — Register Now <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </ScrollSection>

      {/* Registration CTA */}
      <ScrollSection className="py-10 px-4 bg-section-alt" delay={0}>
        <div id="register" className="container max-w-xl scroll-mt-8 text-center">
          <SectionLabel>Register</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Register Now — It's FREE
          </h2>
          <p className="text-muted-foreground mb-2">60 minutes. Zero fluff. 100% free for senior developers.</p>
          <p className="text-orange-400 font-semibold text-sm mb-4 animate-pulse">⚡ Only a few seats remaining — Zoom is capped at 200</p>

          <CountdownTimer />

          <a
            href={MEETING_PAGE_URL}
            onClick={() => trackEvent("cta_click", { cta_label: "register_zoom", cta_section: "registration", page_path: "/webinar" })}
            className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Video className="w-5 h-5" /> Claim Your FREE Spot Now <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-muted-foreground/60 text-sm mt-4">No credit card required. Can't make it live? Register anyway to get the free recording.</p>
        </div>
      </ScrollSection>

      {/* Closing */}
      <ScrollSection className="py-6 px-4">
        <p className="container max-w-2xl text-center font-display text-2xl sm:text-3xl font-bold text-foreground">
          60 minutes. One complete app. Built live with Claude Code.{" "}
          <span className="text-primary">Watch it. Build it. Ship it.</span>
        </p>
      </ScrollSection>
    </div>
  );
}
