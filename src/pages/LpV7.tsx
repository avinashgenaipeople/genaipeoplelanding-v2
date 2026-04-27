import { useEffect, useState, useCallback } from "react";
import { PageMeta } from "@/components/PageMeta";
import { SectionLabel } from "@/components/ui/section-label";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/sections/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { trackEvent } from "@/lib/analytics";
import { getAllParams } from "@/lib/utm";
import { scoreQuizLead, getTrainingRedirect } from "@/lib/lead-scoring";
import { ArrowRight, ArrowLeft, X, CheckCircle2, Play } from "lucide-react";

/* ── Quiz Questions ──────────────────────────────────────────────── */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Are you currently working as a software developer?",
    options: [
      { label: "Yes, full-time", value: "yes_fulltime" },
      { label: "Yes, but looking for a change", value: "yes_looking" },
      { label: "No, I was recently laid off", value: "no_laid_off" },
      { label: "No, I'm in a different role", value: "no_different" },
    ],
  },
  {
    id: 2,
    question: "How many years of professional development experience do you have?",
    options: [
      { label: "Less than 3 years", value: "lt_3" },
      { label: "3–5 years", value: "3_5" },
      { label: "5–10 years", value: "5_10" },
      { label: "10–15 years", value: "10_15" },
      { label: "15+ years", value: "15_plus" },
    ],
  },
  {
    id: 3,
    question: "What is your primary programming language?",
    options: [
      { label: "Java", value: "java" },
      { label: "Python", value: "python" },
      { label: "JavaScript / TypeScript", value: "js_ts" },
      { label: "C# / .NET", value: "csharp" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: 4,
    question: "Have you used any AI tools (like ChatGPT, Copilot, or Claude) in your daily work?",
    options: [
      { label: "Yes, regularly", value: "yes_regularly" },
      { label: "I've tried them a few times", value: "tried_few" },
      { label: "No, not yet", value: "no" },
    ],
  },
  {
    id: 5,
    question: "What concerns you most about AI's impact on your career?",
    options: [
      { label: "My role could be automated or eliminated", value: "automated" },
      { label: "I'm falling behind developers who use AI", value: "falling_behind" },
      { label: "I don't know how to transition into AI roles", value: "no_path" },
      { label: "I'm not concerned — I just want to grow", value: "want_growth" },
    ],
  },
  {
    id: 6,
    question: "If there were a clear path to an AI role, how soon would you want to start?",
    options: [
      { label: "Immediately — I'm ready now", value: "immediately" },
      { label: "Within the next 1–3 months", value: "1_3_months" },
      { label: "I'm just exploring for now", value: "exploring" },
    ],
  },
  {
    id: 7,
    question: "Would you like a personalised roadmap for your AI transition?",
    options: [
      { label: "Yes, show me", value: "yes" },
      { label: "Maybe — I'd like to learn more first", value: "maybe" },
    ],
  },
  {
    id: 8,
    question: "What is your current annual compensation?",
    options: [
      { label: "0–10 Lakhs", value: "0_10" },
      { label: "10–15 Lakhs", value: "10_15" },
      { label: "15–20 Lakhs", value: "15_20" },
      { label: "20–30 Lakhs", value: "20_30" },
      { label: "30–45 Lakhs", value: "30_45" },
      { label: "45+ Lakhs", value: "45_plus" },
    ],
  },
];

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/HADyq7BakZrOyu15lic7/webhook-trigger/e5a21b54-2012-479a-a948-233c0c543245";

const TRAINING_URL = "/training";

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  1: {
    yes_fulltime: "Yes, full-time",
    yes_looking: "Yes, but looking for a change",
    no_laid_off: "No, I was recently laid off",
    no_different: "No, I'm in a different role",
  },
  2: {
    lt_3: "Less than 3 years",
    "3_5": "3-5 years",
    "5_10": "5-10 years",
    "10_15": "10-15 years",
    "15_plus": "15+ years",
  },
  3: {
    java: "Java",
    python: "Python",
    js_ts: "JavaScript / TypeScript",
    csharp: "C# / .NET",
    other: "Other",
  },
  4: {
    yes_regularly: "Yes, regularly",
    tried_few: "I've tried them a few times",
    no: "No, not yet",
  },
  5: {
    automated: "My role could be automated or eliminated",
    falling_behind: "I'm falling behind developers who use AI",
    no_path: "I dont know how to transition",
    want_growth: "I'm not concerned — I just want to grow",
  },
  6: {
    immediately: "Immediately",
    "1_3_months": "Within the next 1-3 months",
    exploring: "I'm just exploring for now",
  },
  7: {
    yes: "Yes",
    maybe: "Maybe",
  },
  8: {
    "0_10": "0-10 Lakhs",
    "10_15": "10-15 Lakhs",
    "15_20": "15-20 Lakhs",
    "20_30": "20-30 Lakhs",
    "30_45": "30-45 Lakhs",
    "45_plus": "45+ Lakhs",
  },
};

/* ── V1 Content Data ─────────────────────────────────────────────── */
const secrets = [
  {
    title: "Secret #1",
    subtitle: "AI multiplies senior engineers — into 30–70L candidates.",
    text: "The developers landing top AI roles aren't juniors — they're experienced engineers who know what to build and use AI to build it 10x faster.",
  },
  {
    title: "Secret #2",
    subtitle: "Your Java skills are the foundation.",
    text: "Enterprise architecture, system design, production debugging — AI amplifies all of it. You're not starting over, you're levelling up.",
  },
  {
    title: "Secret #3",
    subtitle: "Speed is the new seniority — and it pays 2–3x more.",
    text: "The engineers getting promoted now ship in days what used to take weeks. AI is their multiplier, and companies are paying 30–70L for it.",
  },
];

const REDIRECT_DELAY = 0;

/* ── Transition Screen (step 9) ──────────────────────────────────── */
function TransitionScreen({ name, redirectUrl }: { name: string; redirectUrl: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Lead event removed — fires on training page (learning.genaipeople.com)
    // to avoid duplicate Lead pixels per user.
    trackEvent("quiz_redirect_training", { page_path: window.location.pathname });

    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => {
      window.location.href = redirectUrl;
    }, REDIRECT_DELAY);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [redirectUrl]);

  return (
    <div className="text-center">
      {/* Play icon with pulse */}
      <div className="relative mx-auto w-20 h-20 mb-6">
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_2s_ease-out_infinite]" />
        <span className="absolute inset-2 rounded-full bg-primary/15 animate-[ping_2s_ease-out_0.4s_infinite]" />
        <div
          className="relative z-10 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-700"
          style={{ transform: step >= 0 ? "scale(1)" : "scale(0)" }}
        >
          <Play className="w-9 h-9 text-primary ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Title */}
      <h2
        className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 transition-all duration-700"
        style={{
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? "translateY(0)" : "translateY(20px)",
        }}
      >
        Loading Your Free Training{name ? `, ${name.split(" ")[0]}` : ""}...
      </h2>

      {/* Subtitle */}
      <p
        className="text-white/60 text-lg mb-8 transition-all duration-700 delay-200"
        style={{
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? "translateY(0)" : "translateY(20px)",
        }}
      >
        28-minute video on how senior devs transition into AI
      </p>

      {/* Progress bar + redirect message */}
      <div
        className="transition-all duration-500"
        style={{ opacity: step >= 2 ? 1 : 0 }}
      >
        <p className="text-white/80 font-medium mb-4">
          Taking you to the video now...
        </p>
        <div className="mx-auto w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all ease-linear"
            style={{
              width: step >= 2 ? "100%" : "0%",
              transitionDuration: `${REDIRECT_DELAY - 1500}ms`,
            }}
          />
        </div>
        <a
          href={redirectUrl}
          className="inline-block mt-6 text-white/40 text-sm underline underline-offset-2 hover:text-white/70 transition-colors"
        >
          Click here if you're not redirected
        </a>
      </div>
    </div>
  );
}

/* ── Quiz Overlay ────────────────────────────────────────────────── */
function QuizOverlay({
  isOpen,
  currentStep,
  answers,
  contactInfo,
  isSubmitting,
  redirectUrl,
  onSelectAnswer,
  onBack,
  onClose,
  onContactChange,
  onSubmit,
}: {
  isOpen: boolean;
  currentStep: number;
  answers: Record<number, string>;
  contactInfo: { name: string; email: string; phone: string };
  isSubmitting: boolean;
  redirectUrl: string;
  onSelectAnswer: (questionId: number, value: string) => void;
  onBack: () => void;
  onClose: () => void;
  onContactChange: (field: "name" | "email" | "phone", value: string) => void;
  onSubmit: () => void;
}) {
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const question = currentStep >= 1 && currentStep <= 8 ? QUIZ_QUESTIONS[currentStep - 1] : null;
  const progressPercent = currentStep <= 8 ? (currentStep / 8) * 100 : 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors"
        aria-label="Close quiz"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Progress bar (steps 1-7 only) */}
      {currentStep <= 8 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Step 1-7: Questions */}
        {question && (
          <div className="text-center">
            {/* Step 1 intro header — sets context */}
            {currentStep === 1 && (
              <div className="mb-6">
                <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
                  60-Second Career Quiz
                </p>
                <p className="text-white/60 text-base leading-relaxed max-w-md mx-auto">
                  Answer 8 quick questions to find out if you qualify for a 30–70L AI role — and get your personalised roadmap.
                </p>
              </div>
            )}
            {currentStep > 1 && (
              <p className="text-white/50 text-sm mb-6 font-medium">
                Question {currentStep} of 8
              </p>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-8">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelectAnswer(question.id, option.value)}
                  className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 border ${
                    answers[question.id] === option.value
                      ? "bg-primary/20 border-primary text-white"
                      : "bg-card/10 border-white/10 text-white hover:border-primary/50 hover:bg-card/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={onBack}
                className="mt-6 inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
        )}

        {/* Step 9: Name + Phone form */}
        {currentStep === 9 && (() => {
          const leadScore = scoreQuizLead(answers);
          return (
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                {leadScore === "hot" ? "Great news — you're a strong fit!" : leadScore === "warm" ? "Great — let's get you started!" : "Here's your roadmap!"}
              </h2>
              <p className="text-white/60 text-lg">
                Enter your details to get instant access to the 28-min video explaining the transition from Senior Dev into an AI Engineer.
              </p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
              className="space-y-4 max-w-sm mx-auto"
            >
              <input
                type="text"
                placeholder="Full name"
                value={contactInfo.name}
                onChange={(e) => onContactChange("name", e.target.value)}
                required
                className="w-full px-5 py-4 rounded-xl bg-card/10 border border-white/10 text-white placeholder:text-white/40 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                value={contactInfo.email}
                onChange={(e) => onContactChange("email", e.target.value)}
                required
                className="w-full px-5 py-4 rounded-xl bg-card/10 border border-white/10 text-white placeholder:text-white/40 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={contactInfo.phone}
                onChange={(e) => onContactChange("phone", e.target.value)}
                required
                className="w-full px-5 py-4 rounded-xl bg-card/10 border border-white/10 text-white placeholder:text-white/40 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting…" : "Watch the Free Training"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          );
        })()}

        {/* Step 10: Transition screen → redirect to training video */}
        {currentStep === 10 && (
          <TransitionScreen name={contactInfo.name} redirectUrl={redirectUrl} />
        )}
      </div>

    </div>
  );
}

/* ── V7 CTA Button (local, calls openQuiz instead of openFormModal) */
function V7CTAButton({
  children,
  section,
  size = "default",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  section: string;
  size?: "default" | "large" | "small";
  className?: string;
  onClick: () => void;
}) {
  const sizeClasses = {
    small: "px-5 py-3 text-base",
    default: "px-7 py-4 text-lg",
    large: "px-10 py-5 text-xl",
  };

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("cta_click", { cta_label: String(children), cta_section: section, page_path: window.location.pathname });
        onClick();
      }}
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} font-bold text-primary-foreground bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors animate-pulse-glow ${className}`}
    >
      {children}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

/* ── V7 Sticky Desktop Header ─────────────────────────────────────── */
function V7StickyDesktopHeader({ openQuiz }: { openQuiz: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className="bg-card/95 backdrop-blur-lg border-b border-border px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-card/100 transition-colors"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          trackEvent("cta_click", { cta_label: "sticky_desktop_bar", cta_section: "sticky_desktop", page_path: window.location.pathname });
          openQuiz();
        }}
        role="button"
        tabIndex={0}
      >
        <span className="font-display text-lg font-bold text-foreground">
          GenAI People
        </span>
        <div className="flex items-center gap-4">
          <span className="text-base text-muted-foreground">
            Senior Java Dev → AI Architect
          </span>
          <V7CTAButton size="small" section="sticky_desktop" onClick={openQuiz}>
            Take the Quiz
          </V7CTAButton>
        </div>
      </div>
    </div>
  );
}

/* ── V7 Sticky Mobile Bar ─────────────────────────────────────────── */
function V7StickyMobileBar({ openQuiz }: { openQuiz: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => {
          trackEvent("cta_click", { cta_label: "sticky_mobile_bar", cta_section: "sticky_mobile", page_path: window.location.pathname });
          openQuiz();
        }}
      >
        <span className="text-lg font-medium text-foreground">
          Qualify for 30–70L AI roles
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            trackEvent("cta_click", { cta_label: "Take the Quiz", cta_section: "sticky_mobile", page_path: window.location.pathname });
            openQuiz();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-base font-semibold rounded-full shadow-lg"
        >
          Take the Quiz
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── V7 Hero Section ──────────────────────────────────────────────── */
function V7HeroSection({ openQuiz }: { openQuiz: () => void }) {
  return (
    <>
      {/* Sumo bar */}
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { cta_label: "sumo_bar", cta_section: "sumo_bar", page_path: window.location.pathname });
          openQuiz();
        }}
        className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <p className="text-sm sm:text-base font-semibold">
          Free Video: How Senior Java Devs Are Landing 30–70L AI Jobs (Without Another Certificate)
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              Senior <span className="text-primary">Java Developers</span> Use Your Java Skills to Land a{" "}
              <span className="text-primary">30–70L AI Job</span>
            </h1>

            {/* Video thumbnail */}
            <div className="mt-8 glass-card max-w-none sm:max-w-4xl overflow-hidden -mx-[calc(1rem+24px)] sm:mx-auto rounded-none sm:rounded-xl">
              <button
                type="button"
                onClick={() => {
                  trackEvent("cta_click", { cta_label: "hero_video_thumbnail", cta_section: "hero_video", page_path: window.location.pathname });
                  openQuiz();
                }}
                className="group relative w-full aspect-[1408/736] overflow-hidden bg-black text-left cursor-pointer"
                aria-label="Take the quiz"
              >
                <div className="absolute inset-0">
                  <img
                    src="/hero-thumbnail.webp"
                    alt="How to use your Java skills to land a high-paying AI job — Jerry Kurian"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              150+ senior Java developers are already using this system to land AI roles paying 30–70L — without starting over or collecting another certificate.
            </p>

            <div className="mt-9">
              <V7CTAButton size="default" section="hero" onClick={openQuiz}>
                Find Out If You Qualify
              </V7CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">Take the 60-second quiz. No credit card. No strings.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V7 Problem / Secrets Section ─────────────────────────────────── */
function V7ProblemSection({ openQuiz }: { openQuiz: () => void }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>Video Highlights</SectionLabel>
          <p className="text-base sm:text-lg font-semibold text-foreground/85 mb-4">
            3 secrets to future-proofing your salary and your skillset.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            How Senior Java Devs Are Landing{" "}
            <span className="text-primary">High-Paying AI Jobs</span> at{" "}
            <span className="text-primary">30–70L Per Year</span> — Using Skills They Already Have.
          </h2>
          <V7CTAButton size="default" section="problem_top" onClick={openQuiz}>
            Take the Quiz
          </V7CTAButton>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 mb-10">
          {secrets.map((secret, index) => (
            <div
              key={secret.title}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-3xl font-display font-bold underline mb-4">{secret.title}</h3>
              <p className="text-2xl font-semibold text-foreground mb-5 leading-snug">{secret.subtitle}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">{secret.text}</p>
            </div>
          ))}
        </div>

        <p className="text-2xl sm:text-3xl text-foreground mb-6">
          Are you ready for the shift? Find out in <span className="text-primary font-semibold">60 seconds</span>.
        </p>
        <V7CTAButton size="default" section="problem_bottom" onClick={openQuiz}>
          Take the Quiz
        </V7CTAButton>
      </div>
    </section>
  );
}

/* ── V7 Final CTA Section ─────────────────────────────────────────── */
function V7FinalCTASection({ openQuiz }: { openQuiz: () => void }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      className="py-8 sm:py-10 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background border-t border-primary/20"
      ref={ref}
    >
      <div className="container max-w-3xl text-center">
        <div
          className={`space-y-4 mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Ready to <span className="text-primary">land a 30–70L AI role</span>? Take the quiz, then get your roadmap.
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            8 quick questions to see if you're a fit. Then get instant access to the 28-min training.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <V7CTAButton size="large" section="final_cta" className="text-lg px-10 py-5" onClick={openQuiz}>
            Find Out If You Qualify
          </V7CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          60-second quiz. No credit card. No strings. 150+ devs already inside.
        </p>
      </div>
    </section>
  );
}

/* ── Page Component ────────────────────────────────────────────────── */
const LpV7 = () => {
  // Quiz state
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(TRAINING_URL);

  useEffect(() => {
    trackEvent("page_view_lp_v7", { page_path: window.location.pathname });
  }, []);

  const openQuiz = useCallback(() => {
    setQuizOpen(true);
    setCurrentStep(1);
    setAnswers({});
    setContactInfo({ name: "", email: "", phone: "" });
    setIsSubmitting(false);
    trackEvent("quiz_open", { page_path: window.location.pathname });
    // FB: ViewContent — user engaged with quiz
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", { content_name: "LpV7 Quiz" });
    }
  }, []);

  const closeQuiz = useCallback(() => {
    if (currentStep < 10) {
      trackEvent("quiz_close", { last_step: currentStep, page_path: window.location.pathname });
    }
    setQuizOpen(false);
  }, [currentStep]);

  const selectAnswer = useCallback((questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    trackEvent("quiz_answer", { question_id: questionId, answer: value, step: questionId, page_path: window.location.pathname });
    // Auto-advance
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      if (questionId === 8) {
        trackEvent("quiz_completed", {
          page_path: window.location.pathname,
          q1: answers[1] || "",
          q2: answers[2] || "",
          q3: answers[3] || "",
          q4: answers[4] || "",
          q5: answers[5] || "",
          q6: answers[6] || "",
          q7: answers[7] || "",
          q8: value,
        });
        // CompleteRegistration moved to handleSubmit — only fires for hot leads
      }
    }, 200);
  }, [answers]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      closeQuiz();
    }
  }, [currentStep, closeQuiz]);

  const handleContactChange = useCallback((field: "name" | "email" | "phone", value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!contactInfo.name.trim() || !contactInfo.email.trim() || !contactInfo.phone.trim()) return;
    setIsSubmitting(true);

    // Fire analytics
    trackEvent("quiz_form_submit", {
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      page_path: window.location.pathname,
      ...Object.fromEntries(Object.entries(answers).map(([k, v]) => [`q${k}`, v])),
    });
    trackEvent("lead_form_submit", {
      form_id: "lp-v7-quiz",
      form_name: "LpV7 Quiz Funnel",
      page_path: window.location.pathname,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }

    // FB: Contact — user submitted their details
    const leadScore = scoreQuizLead(answers);
    const isHot = leadScore === "hot";
    setRedirectUrl(getTrainingRedirect(leadScore));

    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", { content_name: "LpV7 Quiz Funnel" });
      if (isHot) {
        window.fbq("track", "CompleteRegistration", { content_name: "LpV7 Hot Lead" });
        window.fbq("track", "InitiateCheckout", { content_name: "LpV7 Hot Lead" });
      }
    }

    // POST lead to LeadConnector webhook (fire-and-forget)
    const label = (q: number) => ANSWER_LABELS[q]?.[answers[q]] ?? answers[q] ?? "";
    const urlParams = getAllParams();
    fetch(WEBHOOK_URL, { keepalive: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        quiz_current_role: label(1),
        quiz_experience: label(2),
        quiz_language: label(3),
        quiz_ai_usage: label(4),
        quiz_concern: label(5),
        quiz_readiness: label(6),
        quiz_call_interest: label(7),
        quiz_salary: label(8),
        quiz_source: "lp-v7",
        quiz_lead_score: leadScore,
        // URL/attribution params from landing — flattened for CRM field mapping
        utm_source: urlParams.utm_source ?? "",
        utm_medium: urlParams.utm_medium ?? "",
        utm_campaign: urlParams.utm_campaign ?? "",
        utm_term: urlParams.utm_term ?? "",
        utm_content: urlParams.utm_content ?? "",
        utm_adname: urlParams.utm_adname ?? "",
        utm_adid: urlParams.utm_adid ?? "",
        utm_placement: urlParams.utm_placement ?? "",
        utm_ad_account: urlParams.utm_ad_account ?? "",
        utm_id: urlParams.utm_id ?? "",
        fbclid: urlParams.fbclid ?? "",
        gclid: urlParams.gclid ?? "",
        // Full param bag for anything not flattened above
        url_params: urlParams,
      }),
    }).catch(() => {});

    // Move to transition screen
    setCurrentStep(10);
    setIsSubmitting(false);
  }, [contactInfo, answers]);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | Are You AI-Ready? Take the 60-Second Quiz"
        description="Senior Java Developers: find out if you qualify for high-paying AI roles. Take the 60-second quiz and get your personalised career roadmap."
      />
      <V7HeroSection openQuiz={openQuiz} />
      <V7ProblemSection openQuiz={openQuiz} />
      <TestimonialsSection />
      <V7FinalCTASection openQuiz={openQuiz} />
      <Footer />
      <V7StickyDesktopHeader openQuiz={openQuiz} />
      <V7StickyMobileBar openQuiz={openQuiz} />
      <QuizOverlay
        isOpen={quizOpen}
        currentStep={currentStep}
        answers={answers}
        contactInfo={contactInfo}
        isSubmitting={isSubmitting}
        redirectUrl={redirectUrl}
        onSelectAnswer={selectAnswer}
        onBack={goBack}
        onClose={closeQuiz}
        onContactChange={handleContactChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LpV7;
