/**
 * V2 lead scoring for the redesigned (Funnel-Professor-style) quiz.
 *
 * Primary signals (the only two that determine the base tier):
 *   - experience  (Q9: lt_3 / 3_5 / 5_10 / 10_15 / 15_plus)
 *   - salary      (Q10: 0_10 / 10_15 / 15_20 / 20_30 / 30_45 / 45_plus)
 *
 * Cold floor (always cold, regardless of any other signal):
 *   - experience === "lt_3"        — junior is outside ICP, period
 *   - salary === "0_10"            — sub-10L can't sustain program economics
 *
 * Base tier matrix (after the cold floor):
 *
 *                 Salary →
 *  Experience    10-15  15-20  20-30  30-45  45+
 *  3_5  (mid)      C      W      W      W     W
 *  5_10 (sr)       W      H      H      H     H
 *  10_15 (sr+)     W      H      H      H     H
 *  15+  (vsr)      W      H      H      H     H
 *
 * Adjusters (applied AFTER the matrix; primary signals still dominate):
 *   - DEMOTE one tier  if timeline === "exploring" AND goal === "not_sure"
 *     (zero-urgency + zero-clarity = not sales-ready right now)
 *   - PROMOTE warm → hot  if timeline === "this_quarter" AND goal is one of
 *     ("senior_ai_30_50", "architect_50_70", "founder_consulting")
 *     (clear high-intent narrows the gap a single tier upward)
 *
 *   Cold is sticky: a cold base can never be promoted to warm.
 */

export type LeadTier = "hot" | "warm" | "cold";

export type ExperienceV2 = "lt_3" | "3_5" | "5_10" | "10_15" | "15_plus";
export type SalaryV2 = "0_10" | "10_15" | "15_20" | "20_30" | "30_45" | "45_plus";
export type TimelineV2 = "this_quarter" | "next_3_months" | "this_year" | "exploring";
export type GoalV2 =
  | "same_role_ai_fluent"
  | "senior_ai_30_50"
  | "architect_50_70"
  | "founder_consulting"
  | "not_sure";

export interface QuizSignalsV2 {
  experience: ExperienceV2 | undefined;
  salary: SalaryV2 | undefined;
  timeline: TimelineV2 | undefined;
  goal: GoalV2 | undefined;
}

const EXP_RANK: Record<ExperienceV2, number> = {
  lt_3: 0,
  "3_5": 1,
  "5_10": 2,
  "10_15": 3,
  "15_plus": 4,
};

const SAL_RANK: Record<SalaryV2, number> = {
  "0_10": 0,
  "10_15": 1,
  "15_20": 2,
  "20_30": 3,
  "30_45": 4,
  "45_plus": 5,
};

const HIGH_INTENT_GOALS: ReadonlySet<GoalV2> = new Set<GoalV2>([
  "senior_ai_30_50",
  "architect_50_70",
  "founder_consulting",
]);

function baseTier(experience: ExperienceV2, salary: SalaryV2): LeadTier {
  if (experience === "lt_3") return "cold";
  if (salary === "0_10") return "cold";

  const e = EXP_RANK[experience];
  const s = SAL_RANK[salary];

  // Senior (5+ yrs) AND salary 15L+ → hot
  if (e >= 2 && s >= 2) return "hot";
  // Mid (3-5 yrs) AND salary 15L+ → warm
  if (e === 1 && s >= 2) return "warm";
  // Senior AND salary 10-15L → warm
  if (e >= 2 && s === 1) return "warm";
  // Everything else (mid + 10-15L, edge cases) → cold
  return "cold";
}

function demote(tier: LeadTier): LeadTier {
  if (tier === "hot") return "warm";
  if (tier === "warm") return "cold";
  return "cold";
}

export function scoreQuizLeadV2(signals: QuizSignalsV2): LeadTier {
  const { experience, salary, timeline, goal } = signals;
  if (!experience || !salary) return "cold";

  const base = baseTier(experience, salary);

  // Demoter: zero urgency + zero clarity
  if (timeline === "exploring" && goal === "not_sure") {
    return demote(base);
  }

  // Promoter: warm → hot when urgent and clear high-intent goal
  if (
    base === "warm" &&
    timeline === "this_quarter" &&
    goal &&
    HIGH_INTENT_GOALS.has(goal)
  ) {
    return "hot";
  }

  return base;
}

/**
 * Risk score 0-100 for the diagnosis screen. Driven by the agreement-barrage
 * answers, the cost-expansion multi-select, and the worry-frequency anchor.
 * Independent of the hot/warm/cold tier — used purely for the result UI.
 */
export type WorryFrequency = "daily" | "weekly" | "sometimes" | "rarely" | "never";
export type Likert = "strongly_agree" | "agree" | "neutral" | "disagree";

export interface RiskInputs {
  worry: WorryFrequency | undefined;
  likertVelocity: Likert | undefined;     // Q3
  likertImplementation: Likert | undefined; // Q4
  likertUrgency: Likert | undefined;       // Q5
  likertCourses: Likert | undefined;       // Q6
  costCount: number;                       // # of costs selected in Q7 (0-7)
}

const WORRY_POINTS: Record<WorryFrequency, number> = {
  daily: 20,
  weekly: 15,
  sometimes: 10,
  rarely: 5,
  never: 0,
};

const LIKERT_POINTS: Record<Likert, number> = {
  strongly_agree: 10,
  agree: 7,
  neutral: 3,
  disagree: 0,
};

export function computeRiskScore(r: RiskInputs): number {
  const worryPts = r.worry ? WORRY_POINTS[r.worry] : 0;
  const lkPts =
    (r.likertVelocity ? LIKERT_POINTS[r.likertVelocity] : 0) +
    (r.likertImplementation ? LIKERT_POINTS[r.likertImplementation] : 0) +
    (r.likertUrgency ? LIKERT_POINTS[r.likertUrgency] : 0) +
    (r.likertCourses ? LIKERT_POINTS[r.likertCourses] : 0);
  const costPts = Math.min(r.costCount, 7) * 5; // 7 × 5 = 35

  // worry max 20 + likert max 40 + cost max 35 = 95; normalize to 100.
  const raw = worryPts + lkPts + costPts;
  return Math.round((raw / 95) * 100);
}

export interface RiskTypeInputs {
  experience: ExperienceV2 | undefined;
  worry: WorryFrequency | undefined;
  costCount: number;
  goal: GoalV2 | undefined;
}

/**
 * Maps the quiz answer pattern to a "risk type" label shown on the diagnosis
 * screen. Names are deliberately on-brand and defensible — they're observed
 * traits, not dismissive labels.
 */
export function riskType(r: RiskTypeInputs): string {
  const isSenior = r.experience === "5_10" || r.experience === "10_15" || r.experience === "15_plus";
  const isMid = r.experience === "3_5";
  const highWorry = r.worry === "daily" || r.worry === "weekly";
  const lowWorry = r.worry === "rarely" || r.worry === "never";

  if (isSenior && highWorry && r.costCount >= 3) return "Plateaued Architect";
  if (isSenior && highWorry) return "Falling-Behind Senior";
  if (isSenior && lowWorry) return "AI-Adjacent Senior";
  if (isMid && highWorry) return "Catching-Up Builder";
  if (isMid) return "Mid-Level Pivoter";
  return "Career Explorer";
}

/**
 * Time-to-pivot estimate in months, derived from timeline + experience.
 */
export function timeToPivotMonths(timeline: TimelineV2 | undefined, experience: ExperienceV2 | undefined): number {
  const expFast = experience === "5_10" || experience === "10_15" || experience === "15_plus";
  switch (timeline) {
    case "this_quarter": return expFast ? 3 : 4;
    case "next_3_months": return expFast ? 4 : 5;
    case "this_year": return 6;
    case "exploring":
    default:
      return 9;
  }
}

/**
 * Picks the strongest "biggest risk factor" headline shown on the diagnosis
 * screen — the Likert axis the user agreed with most strongly.
 */
export function biggestRiskFactor(r: {
  likertVelocity: Likert | undefined;
  likertImplementation: Likert | undefined;
  likertUrgency: Likert | undefined;
  likertCourses: Likert | undefined;
}): string {
  const score = (l: Likert | undefined) => (l ? LIKERT_POINTS[l] : 0);
  const ranked: Array<[number, string]> = [
    [score(r.likertVelocity), "AI velocity gap — peers using AI tools are moving faster"],
    [score(r.likertImplementation), "Implementation gap — unclear how to apply AI beyond prompts"],
    [score(r.likertUrgency), "Pivot-window urgency — falling behind in the next 12 months"],
    [score(r.likertCourses), "Wrong learning path — generic courses aren't moving the needle"],
  ];
  ranked.sort((a, b) => b[0] - a[0]);
  return ranked[0][1];
}

/**
 * Returns the post-quiz redirect URL based on the V2 lead tier.
 * Hot → calendar VSL, warm/cold → video-only training page.
 */
export function getTrainingRedirectV2(tier: LeadTier): string {
  return tier === "hot" ? "/training-vsl" : "/training";
}
