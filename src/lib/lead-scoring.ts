/**
 * 3-tier lead scoring based on quiz answers.
 *
 * Hot: experienced (5+ years) + urgent (immediately/1-3mo) + interested (yes)
 * Cold: junior (<3 years), or laid off + junior, or exploring + maybe
 * Warm: everyone else (has some signal but not fully qualified)
 */
export function scoreQuizLead(answers: Record<number, string>): "hot" | "warm" | "cold" {
  const experience = answers[2]; // lt_3, 3_5, 5_10, 10_15, 15_plus
  const currentRole = answers[1]; // yes_fulltime, yes_looking, no_laid_off, no_different
  const readiness = answers[6]; // immediately, 1_3_months, exploring
  const callInterest = answers[7]; // yes, maybe

  const isSenior = experience === "5_10" || experience === "10_15" || experience === "15_plus";
  const isMid = experience === "3_5";
  const isJunior = experience === "lt_3";
  const isUrgent = readiness === "immediately" || readiness === "1_3_months";
  const isInterested = callInterest === "yes";
  const isExploring = readiness === "exploring";
  const isMaybe = callInterest === "maybe";
  const isNotWorking = currentRole === "no_laid_off" || currentRole === "no_different";

  // Hot: senior + urgent + interested
  if (isSenior && isUrgent && isInterested) return "hot";

  // Cold: junior always
  if (isJunior) return "cold";

  // Cold: not working + under 5 years
  if (isNotWorking && (isJunior || isMid)) return "cold";

  // Cold: exploring + maybe (zero urgency signals)
  if (isExploring && isMaybe) return "cold";

  // Cold: mid-level + exploring + maybe
  if (isMid && isExploring && isMaybe) return "cold";

  // Everything else is warm
  return "warm";
}

/**
 * Returns the redirect URL based on lead score.
 * Hot leads get calendar page, warm/cold get video-only page.
 */
export function getTrainingRedirect(score: "hot" | "warm" | "cold"): string {
  return score === "hot" ? "/training-vsl" : "/training";
}
