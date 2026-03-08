import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionLabel } from "@/components/ui/section-label";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Video, Zap, Eye, Rocket, CheckCircle2, Linkedin, ArrowRight } from "lucide-react";

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
      {/* Sumo bar */}
      <a
        href="#register"
        onClick={() => trackEvent("cta_click", { cta_label: "sumo_bar", cta_section: "sumo_bar", page_path: "/webinar" })}
        className="block w-full bg-primary text-primary-foreground py-2.5 px-4 text-center cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <p className="text-sm sm:text-base font-semibold">
          Live Workshop: Watch Jerry Kurian Build a Complete App Using Claude Code in 60 Minutes — Register Free →
        </p>
      </a>

      {/* Hero */}
      <section className="px-4 pt-10 pb-8 bg-hero-pattern">
        <div className="container max-w-4xl text-center">
          <span className="highlight-pill text-sm font-semibold tracking-widest uppercase mb-4 inline-block">
            Live on Zoom
          </span>

          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Senior Java Devs:{" "}
            <span className="text-primary">Build a Full App in 60 Min with Claude Code</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-5">
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Calendar className="w-5 h-5 text-primary" /> March 21st</span>
            <span className="text-border text-xl">|</span>
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Clock className="w-5 h-5 text-primary" /> Saturday, 10:45 AM IST</span>
            <span className="text-border text-xl">|</span>
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground"><Video className="w-5 h-5 text-primary" /> Live on Zoom</span>
          </div>

          <p className="mt-4 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Jerry Kurian, founder of GenAI People, will live-build an end-to-end application using Claude Code —{" "}
            <span className="text-foreground font-medium">from blank screen to deployed app. Follow along and build yours too.</span>
          </p>

          <a
            href={MEETING_PAGE_URL}
            onClick={() => trackEvent("cta_click", { cta_label: "register_zoom", cta_section: "hero", page_path: "/webinar" })}
            className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
          >
            Register Free — Build Your First AI App Saturday <ArrowRight className="w-4 h-4" />
          </a>
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

      {/* What You'll Walk Away With */}
      <ScrollSection className="py-6 px-4">
        <div className="container max-w-3xl">
          <SectionLabel>Your Takeaway</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            After 60 minutes, you'll have:
          </h2>
          <div className="space-y-3">
            {[
              "A fully working app you built yourself using Claude Code",
              "A clear understanding of how AI agentic systems actually write, debug, and deploy code",
              "Confidence that your Java and backend skills are an advantage — not a liability",
              "A recording to rewatch and reference anytime",
            ].map((item, i) => (
              <div key={i} className="glass-card flex items-start gap-4 p-5">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Registration CTA */}
      <ScrollSection className="py-10 px-4 bg-section-alt" delay={0}>
        <div id="register" className="container max-w-xl scroll-mt-8 text-center">
          <SectionLabel>Register</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">Register Now</h2>
          <p className="text-muted-foreground mb-6">Free for senior developers. 60 minutes. Zero fluff.</p>

          <a
            href={MEETING_PAGE_URL}
            onClick={() => trackEvent("cta_click", { cta_label: "register_zoom", cta_section: "registration", page_path: "/webinar" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            <Video className="w-5 h-5" /> Save My Spot — It's Free <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-muted-foreground/60 text-sm mt-4">Zoom has a 200-person cap — once it's full, registration closes. Can't make it live? Register anyway to get the recording.</p>
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
