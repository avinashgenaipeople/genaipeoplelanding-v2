import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step =
  | "intro"
  | "q1" | "q2" | "q3" | "q4" | "q5" | "q6"
  | "analyzing"
  | "results";

interface Answers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
}

// ─── Quiz data ──────────────────────────────────────────────────────────────────

interface QuizOption { value: string; label: string; }
interface QuizQuestion {
  id: keyof Answers;
  step: Step;
  next: Step;
  num: number;
  text: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1", step: "q1", next: "q2", num: 1,
    text: "How long have you been working as a Java developer professionally?",
    options: [
      { value: "lt3",   label: "Less than 3 years — just getting started" },
      { value: "3to6",  label: "3–6 years" },
      { value: "7to12", label: "7–12 years" },
      { value: "13plus",label: "13+ years — seen every framework come and go" },
    ],
  },
  {
    id: "q2", step: "q2", next: "q3", num: 2,
    text: "What would a successful career move look like for you in the next 12 months?",
    options: [
      { value: "title",    label: "An AI Architect or GenAI Engineer title" },
      { value: "salary",   label: "A major salary upgrade — into the 30–70L+ bracket" },
      { value: "projects", label: "Building GenAI products that ship to real users" },
      { value: "security", label: "Future-proofing my career before AI replaces my role" },
    ],
  },
  {
    id: "q3", step: "q3", next: "q4", num: 3,
    text: "What has been your biggest obstacle when trying to break into GenAI so far?",
    options: [
      { value: "overload", label: "Too many tools — LangChain, RAG, agents — no clear path" },
      { value: "time",     label: "Can't find time while managing a full-time job" },
      { value: "transfer", label: "Not sure my Java / backend skills transfer to GenAI" },
      { value: "apply",    label: "Tried tutorials but can't apply them to real projects" },
    ],
  },
  {
    id: "q4", step: "q4", next: "q5", num: 4,
    text: "When you really think about it — what's the real reason you haven't made the move yet?",
    options: [
      { value: "confidence", label: "Not confident enough in my GenAI knowledge yet" },
      { value: "startover",  label: "Afraid I'll have to start over and take a pay cut" },
      { value: "timing",     label: "Waiting for the right moment or opportunity" },
      { value: "worth",      label: "Unsure if the time and investment will pay off" },
    ],
  },
  {
    id: "q5", step: "q5", next: "q6", num: 5,
    text: "If your career looks exactly the same 6 months from now — same role, same salary, same Java stack — how does that feel?",
    options: [
      { value: "fine",       label: "Completely fine — I'm satisfied where I am" },
      { value: "unsettling", label: "A bit unsettling — GenAI is moving fast" },
      { value: "stressful",  label: "Stressful — I can see my skills becoming less relevant" },
      { value: "urgent",     label: "Urgent — I know I need to act but don't know how" },
    ],
  },
  {
    id: "q6", step: "q6", next: "analyzing", num: 6,
    text: "Have you tried building anything with GenAI tools yet?",
    options: [
      { value: "none",        label: "Not yet — haven't written a single prompt programmatically" },
      { value: "played",      label: "Played around with ChatGPT / Copilot but nothing production-level" },
      { value: "poc",         label: "Built a small POC or side project using LLM APIs" },
      { value: "integrating", label: "Already integrating GenAI into work projects" },
    ],
  },
];

const CALENDAR_URL = "https://learning.genaipeople.com/apply-70";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getProgress(step: Step): number {
  const map: Record<Step, number> = {
    intro: 0, q1: 8, q2: 22, q3: 38, q4: 54, q5: 70, q6: 86,
    analyzing: 100, results: 100,
  };
  return map[step] ?? 0;
}

function getDiagnosis(answers: Answers) {
  const experience = answers.q1 ?? "3to6";
  const goal       = answers.q2 ?? "title";
  const obstacle   = answers.q3 ?? "overload";
  const objection  = answers.q4 ?? "confidence";
  const urgency    = answers.q5 ?? "unsettling";
  const exposure   = answers.q6 ?? "none";

  // Section 1 — Experience-based opener (Q1)
  const experienceMap: Record<string, string> = {
    lt3:     "As a developer early in your career, you have the rare chance to build GenAI skills before your habits calcify around legacy patterns.",
    "3to6":  "With 3–6 years of Java experience, you've built solid production fundamentals that translate directly to GenAI architecture.",
    "7to12": "With 7–12 years in Java, you have deep production expertise — system design, distributed architecture — that most GenAI engineers simply don't have.",
    "13plus":"With 13+ years of Java experience, you've seen frameworks come and go. But GenAI is different — and your depth of production engineering is exactly what the market values most right now.",
  };

  // Section 2 — Core obstacle diagnosis (Q3)
  const headlineMap: Record<string, string> = {
    overload:  "You're stuck in GenAI Information Overload — and it's costing you years.",
    time:      "You're caught in the 'someday' trap — waiting for time that never comes.",
    transfer:  "You're sitting on a hidden advantage most Java devs don't realise they own.",
    apply:     "You have the knowledge — you're missing the bridge from theory to real GenAI projects.",
  };

  const bodyMap: Record<string, string> = {
    overload:
      "You said your biggest obstacle is too many tools with no clear path. This is the most common trap for senior Java developers. LangChain, LlamaIndex, RAG pipelines, AI agents, vector databases — every week there's a new framework and a new YouTube rabbit hole. The result: months of 'learning GenAI' but no closer to an actual role change. What you need isn't more information. You need a sequenced, mentor-guided system that tells you exactly what to learn and in what order — built specifically for Java developers.",
    time:
      "You said you can't find time while managing a full-time job. Here's the truth: you will never have more free time than you do today. The Java devs who successfully made the switch didn't wait — they found a focused system built around a demanding 10-12 hour workday. You don't need more hours in the day. You need a path that produces tangible results in the limited hours you already have.",
    transfer:
      "You said you're not sure your Java skills transfer to GenAI — and this is the biggest misconception holding senior devs back. System design, distributed architecture, production engineering, Spring Boot microservices: these are precisely what every serious GenAI team desperately needs, and most ML engineers never have. You're not starting from zero. You're starting from a position of enormous hidden advantage that you haven't yet been shown how to leverage.",
    apply:
      "You've tried tutorials but can't connect them to real work. This is tutorial hell — endemic in GenAI education. Most courses teach LLM theory in isolation, never showing you how to integrate GenAI into a production Java service, or how to architect an AI system at enterprise scale. You don't need another 40-hour course. You need a mentor who can show you how a real GenAI project is scoped, built, and shipped — end to end.",
  };

  // Section 3 — Objection handler (Q4)
  const objectionMap: Record<string, string> = {
    confidence: "The confidence gap you're feeling is completely normal. Every senior Java dev we've mentored felt the same way before they started. The truth is: you don't need to become an ML researcher. You need to learn how to architect GenAI systems — and that builds on everything you already know.",
    startover:  "Here's the good news: you won't start over, and you won't take a pay cut. Java developers who add GenAI skills command a premium precisely because they bring production engineering experience that pure ML engineers lack. This is an upgrade, not a restart.",
    timing:     "There is no perfect moment — only the moment you decide to start. The Java devs in our mentoring who moved fastest all say the same thing: 'I wish I'd started three months earlier.' The market is hiring GenAI architects now. Waiting only makes the gap harder to close.",
    worth:      "The ROI question is valid — and the numbers are clear. GenAI Architect roles in India are commanding 30–70L+, and the supply of qualified candidates is far below demand. A 120-day focused investment to move into a role that could double your compensation is one of the highest-ROI career moves available to Java developers today.",
  };

  // Section 4 — GenAI exposure assessment (Q6)
  const exposureMap: Record<string, string> = {
    none:        "You haven't started building with GenAI yet — and that's completely fine. Most of our mentees started exactly where you are. The important thing is you're here now, asking the right questions.",
    played:      "You've explored ChatGPT and Copilot — which means you already understand the potential. But there's a massive gap between using AI tools and architecting AI systems. That's exactly the gap our mentoring closes.",
    poc:         "You've already built a POC — which puts you ahead of 80% of Java developers. You've seen what's possible. Now you need the structured path to go from side project to production-grade GenAI systems.",
    integrating: "You're already integrating GenAI at work — impressive. You're further along than most. What you need now isn't basics — it's the architectural patterns, best practices, and career positioning to make this your full-time identity.",
  };

  // Section 5 — Urgency close (Q5)
  const urgencyMap: Record<string, string> = {
    urgent:      "Your sense of urgency is well-founded. The window for senior Java devs to enter GenAI at a premium salary is open right now — but it won't stay open forever. Companies are hiring architects who can bridge Java and AI today.",
    stressful:   "Your instincts are right. Every month you stay in a pure Java role is a month the GenAI wave moves further ahead without you. The developers making the switch now are locking in the best roles.",
    unsettling:  "That uneasy feeling is data. The developers who act on it now will be the GenAI architects writing their own ticket in 2026 and beyond.",
    fine:        "Even if you're comfortable today, having a clear picture of how your Java skills map to GenAI roles is worth 45 minutes of your time. The landscape is shifting fast.",
  };

  // Goal-aligned bridge copy (Q2)
  const bridgeMap: Record<string, string> = {
    title:    "In our strategy call, we'll map out how to position yourself for an AI Architect or GenAI Engineer title — leveraging your Java background as a competitive advantage.",
    salary:   "In our strategy call, we'll map out the fastest path to the 30–70L+ salary bracket — showing you exactly which GenAI skills command the highest premiums for Java developers.",
    projects: "In our strategy call, we'll show you how to go from Java backend developer to shipping real GenAI products — the kind that make it to production, not just a Jupyter notebook.",
    security: "In our strategy call, we'll map out how to future-proof your career by adding GenAI architecture skills that make you indispensable — not replaceable — as AI transforms the industry.",
  };

  return {
    experienceOpener: experienceMap[experience] ?? experienceMap["3to6"],
    headline:         headlineMap[obstacle]      ?? headlineMap.overload,
    body:             bodyMap[obstacle]           ?? bodyMap.overload,
    objection:        objectionMap[objection]     ?? objectionMap.confidence,
    exposure:         exposureMap[exposure]       ?? exposureMap.none,
    urgency:          urgencyMap[urgency]         ?? urgencyMap.unsettling,
    bridge:           bridgeMap[goal]             ?? bridgeMap.title,
  };
}

// ─── Dot-stepper ────────────────────────────────────────────────────────────────

function DotStepper({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            n < current  ? "w-6 bg-primary" :
            n === current ? "w-8 bg-primary" :
                            "w-4 bg-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function QuizFlow() {
  const [step, setStep]               = useState<Step>("intro");
  const [answers, setAnswers]         = useState<Answers>({});
  const [selected, setSelected]       = useState<string | null>(null);

  const progress    = getProgress(step);
  const showProgress = step !== "intro" && step !== "results";

  // Reset selected highlight on step change
  useEffect(() => { setSelected(null); }, [step]);

  // Auto-advance from analyzing → results
  useEffect(() => {
    if (step !== "analyzing") return;
    trackEvent("quiz_completed", { page_path: window.location.pathname });
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    if (typeof window.fbq === "function")  window.fbq("track", "Lead", { content_name: "Quiz Funnel" });
    const timer = setTimeout(() => setStep("results"), 2700);
    return () => clearTimeout(timer);
  }, [step]);

  // ── Option click: highlight → wait → advance ─────────────────────────────────
  const handleOption = (qId: keyof Answers, value: string, next: Step) => {
    if (selected) return;
    setSelected(value);
    trackEvent("quiz_question_answered", { question: qId, answer: value, page_path: window.location.pathname });
    setTimeout(() => {
      setAnswers((p) => ({ ...p, [qId]: value }));
      setStep(next);
    }, 320);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Sumo bar */}
      <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center shrink-0">
        <p className="text-sm font-semibold">
          FREE Strategy Call with GenAI People — Get Your Personalised GenAI Architect Roadmap in 45 Mins
        </p>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-1.5 bg-muted shrink-0 transition-opacity duration-300 ${showProgress ? "opacity-100" : "opacity-0"}`}>
        <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 md:py-16">

        {/* INTRO */}
        {step === "intro" && (
          <div key="intro" className="max-w-2xl w-full text-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20">
              ⚡ 2-Minute Career Diagnosis
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Are You Ready to Become a{" "}
              <span className="text-primary">GenAI Architect</span> in 120 Days?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Answer 6 quick questions and get a personalised diagnosis of what's holding you back — then book a free strategy call to map out your fastest path to an AI Architect role.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Takes 2 minutes</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Personalised to your situation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Free strategy call at the end</span>
            </div>
            <button
              onClick={() => { trackEvent("quiz_started", { page_path: window.location.pathname }); setStep("q1"); }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.99]"
            >
              Start My Diagnosis <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted-foreground/60">150+ Java developers are already part of our mentoring</p>
          </div>
        )}

        {/* QUESTIONS */}
        {QUESTIONS.map((q) => step === q.step && (
          <div key={q.step} className="max-w-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Question header */}
            <div className="flex items-center justify-between mb-7">
              <span className="text-sm font-medium text-muted-foreground">
                Question {q.num} <span className="text-muted-foreground/40">of 6</span>
              </span>
              <DotStepper current={q.num} />
            </div>

            <h2 className="font-display text-xl sm:text-2xl md:text-[1.7rem] font-bold text-foreground leading-snug mb-7">
              {q.text}
            </h2>

            <div className="grid gap-3">
              {q.options.map((opt) => {
                const isSelected = selected === opt.value;
                const isDimmed   = selected !== null && !isSelected;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleOption(q.id, opt.value, q.next)}
                    disabled={selected !== null}
                    className={`
                      w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base
                      transition-all duration-200 flex items-center gap-3.5
                      ${isSelected ? "border-primary bg-primary/10 text-primary scale-[0.992]"
                        : isDimmed  ? "border-border bg-card text-foreground/40 cursor-not-allowed"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5 hover:translate-x-0.5 cursor-pointer"}
                    `}
                  >
                    {/* Radio dot */}
                    <span className={`
                      w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"}
                    `}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* ANALYZING */}
        {step === "analyzing" && (
          <div key="analyzing" className="max-w-md w-full text-center space-y-7 animate-in fade-in duration-500">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-primary/10 border-t-primary/50 animate-spin [animation-direction:reverse] [animation-duration:1.4s]" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Analysing your profile…</h2>
              <p className="text-muted-foreground mt-2 text-sm">This takes just a moment</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground text-left max-w-xs mx-auto">
              <p className="flex items-center gap-2"><span className="text-primary">▶</span> Mapping your experience level</p>
              <p className="flex items-center gap-2 opacity-75"><span className="text-primary">▶</span> Identifying your specific blockers</p>
              <p className="flex items-center gap-2 opacity-50"><span className="text-primary">▶</span> Building your personalised GenAI readiness report</p>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <ResultsPage answers={answers} />
        )}
      </div>

      {/* Minimal footer */}
      {step !== "results" && (
        <div className="text-center py-4 text-xs text-muted-foreground/45 shrink-0">
          © {new Date().getFullYear()} AI Architect Academy · 150+ Java devs in our mentoring
        </div>
      )}
    </div>
  );
}

// ─── Results Page ───────────────────────────────────────────────────────────────

function ResultsPage({ answers }: { answers: Answers }) {
  const diagnosis   = getDiagnosis(answers);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    trackEvent("quiz_results_shown", { page_path: window.location.pathname });
  }, []);

  return (
    <div className="max-w-3xl w-full space-y-5 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 sm:pb-12">

      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 text-sm font-bold px-4 py-1.5 rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Your diagnosis is ready
        </div>
        <h2 className="font-display text-xl sm:text-3xl font-bold text-foreground leading-snug">
          Here's what's{" "}
          <span className="text-primary">actually holding you back</span>{" "}
          from becoming a GenAI-native developer:
        </h2>
      </div>

      {/* Diagnosis card */}
      <div className="bg-card border border-border border-l-4 border-l-primary rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-md space-y-3 sm:space-y-4">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{diagnosis.experienceOpener}</p>
        <h3 className="font-display text-base sm:text-xl font-bold text-foreground">
          {diagnosis.headline}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{diagnosis.body}</p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{diagnosis.objection}</p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{diagnosis.exposure}</p>
        <p className="text-sm sm:text-base font-semibold text-foreground">{diagnosis.urgency}</p>
      </div>

      {/* Bridge copy */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <p className="text-base sm:text-lg font-semibold text-foreground">
          The fastest way to fix this? A free 1-on-1 strategy call with our team.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          {diagnosis.bridge}
        </p>
      </div>

      {/* Calendar embed */}
      <div className="rounded-xl sm:rounded-2xl border-2 border-primary/20 overflow-hidden shadow-xl -mx-2 sm:mx-0">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 sm:px-6 sm:py-5 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white">Book Your FREE Strategy Call</h3>
          <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1">
            Reserve your 45-minute slot — limited spots available each week.
          </p>
        </div>
        <div className="relative bg-white" style={{ minHeight: "480px" }}>
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading calendar…</p>
            </div>
          )}
          <iframe
            src={CALENDAR_URL}
            className="w-full border-none"
            style={{ height: "clamp(520px, 80vh, 700px)" }}
            title="Book a Strategy Call"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-5 text-xs sm:text-sm text-muted-foreground">
        <span>✅ 150+ Java devs in our mentoring</span>
        <span>✅ No sales pressure — just a roadmap</span>
        <span>✅ 45 minutes, completely free</span>
        <span>✅ Personalised to your situation</span>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground/45">
        © {new Date().getFullYear()} AI Architect Academy
      </div>
    </div>
  );
}
