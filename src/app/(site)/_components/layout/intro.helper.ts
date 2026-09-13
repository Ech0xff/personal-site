/** Evaluate once per root-layout mount; internal navigation never replays an intro. */
export function shouldPlayIntro(
  navigationType: string | undefined,
  reducedMotion: boolean,
): boolean {
  return navigationType !== "back_forward" && !reducedMotion;
}

/** Draws are supplied by the caller so the permutation is deterministic in tests. */
export function shuffleGreetings(
  greetings: readonly string[],
  draws: readonly number[],
): readonly string[] {
  const result = [...greetings];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(
      (draws[result.length - 1 - index] ?? 0) * (index + 1),
    );
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
