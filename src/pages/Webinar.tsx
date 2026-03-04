import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionLabel } from "@/components/ui/section-label";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Video, Zap, Eye, Rocket, CheckCircle2, Linkedin, ArrowRight } from "lucide-react";

/* ── Registration Form ──────────────────────────────────────── */
function RegistrationForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[\d\s\-+()]{7,}$/.test(form.phone)) errs.phone = "Invalid phone number";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    // Fire-and-forget Supabase insert
    if (supabase) {
      supabase
        .from("webinar_registrations")
        .insert({ name: form.name, email: form.email, phone: form.phone, registered_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error && import.meta.env.DEV) console.warn("[Supabase] webinar insert failed:", error.message);
        });
    }

    // Track event
    trackEvent("webinar_register", { cta_label: "register_form", cta_section: "registration", page_path: "/webinar" });

    // Fire-and-forget n8n webhook (Zoom registration + email sequence)
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone }),
      }).catch(() => {});
    }

    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">You're Registered!</h3>
        <p className="text-muted-foreground">Check your email for the Zoom link. See you on February 15th.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[
        { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", key: "name" as const },
        { id: "email", label: "Email", type: "email", placeholder: "john@example.com", key: "email" as const },
        { id: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000", key: "phone" as const },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-muted-foreground mb-1.5">
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            value={form[field.key]}
            onChange={(e) => {
              setForm((f) => ({ ...f, [field.key]: e.target.value }));
              setErrors((er) => ({ ...er, [field.key]: "" }));
            }}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            placeholder={field.placeholder}
          />
          {errors[field.key] && <p className="text-destructive text-xs mt-1">{errors[field.key]}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Registering…" : "Save My Spot"}
      </button>

      <p className="text-center text-muted-foreground/60 text-sm">Spots are filling up — grab yours</p>
    </form>
  );
}

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
  { icon: Zap, title: "Blank Screen → Deployed App", desc: "Watch a real application get built from absolute zero in 60 minutes flat." },
  { icon: Eye, title: "AI That Actually Ships Code", desc: "See an AI that thinks, plans, and writes production-ready code — not just autocomplete." },
  { icon: Rocket, title: "10x Your Workflow", desc: "Learn how senior developers are using Claude Code to build faster than ever before." },
];

const thisIsForYou = [
  "You're curious about AI coding but skeptical",
  "You want to see what's actually possible right now",
  "You're ready to level up how you build software",
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
          Live Claude Code Workshop — Register Free →
        </p>
      </a>

      {/* Hero */}
      <section className="px-4 pt-16 pb-12 bg-hero-pattern">
        <div className="container max-w-4xl text-center">
          <span className="highlight-pill text-xs font-semibold tracking-widest uppercase mb-6 inline-block">
            Live Workshop
          </span>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Claude Code Sprint:{" "}
            <span className="text-primary">Build a Real App in 60 Minutes</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground mt-6">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> February 15th</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Sunday</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Live on Zoom</span>
          </div>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building a real app from scratch using Claude Code.{" "}
            <span className="text-foreground font-medium">No slides. No theory. Just pure building.</span>
          </p>

          <a
            href="#register"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
          >
            Reserve Your Spot <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* What You'll See */}
      <ScrollSection className="py-10 px-4">
        <div className="container max-w-5xl">
          <SectionLabel>What You'll See</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            This isn't another talking-head webinar.
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg text-lg">
            You'll watch real code being written in real time.
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
      <ScrollSection className="py-10 px-4 bg-section-alt">
        <div className="container max-w-3xl">
          <SectionLabel>Is This For You?</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-10">
            This Is For You If…
          </h2>

          <div className="space-y-4">
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
      <ScrollSection className="py-10 px-4">
        <div className="container max-w-5xl">
          <SectionLabel>Your Host</SectionLabel>

          <div className="glass-card p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src="/jerry-kurian.jpeg"
              alt="Jerry Kurian"
              className="w-36 h-36 rounded-2xl object-cover flex-shrink-0 border-2 border-primary/20"
            />
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">Jerry Kurian</h3>
              <p className="text-primary text-sm font-medium mb-4">Founder &amp; Chief Mentor, GenAI People</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                25+ years in tech. Previously Director of Engineering at an AI company. When ChatGPT launched, Jerry recognized that the way we build software would change fundamentally. He founded GenAI People to help senior developers navigate this transition — and has since mentored 150+ engineers into AI roles.
              </p>
              <a
                href="https://www.linkedin.com/in/jerrykurian/"
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

      {/* Registration Form */}
      <ScrollSection className="py-10 px-4 bg-section-alt" delay={0}>
        <div id="register" className="container max-w-xl scroll-mt-8">
          <SectionLabel>Register</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">Register Now</h2>
          <p className="text-muted-foreground mb-8">Free to attend. Limited spots available.</p>

          <div className="glass-card p-8">
            <RegistrationForm />
          </div>
        </div>
      </ScrollSection>

      {/* Closing */}
      <ScrollSection className="py-10 px-4">
        <p className="container max-w-2xl text-center font-display text-2xl sm:text-3xl font-bold text-foreground">
          60 minutes. One real build.{" "}
          <span className="text-primary">Zero BS.</span>
        </p>
      </ScrollSection>
    </div>
  );
}
