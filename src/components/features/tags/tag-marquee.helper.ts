export const MARQUEE_PIXELS_PER_SECOND = 28;
export const MARQUEE_HALF_GAP_PX = 6;
const DEFAULT_MARQUEE_DURATION_SECONDS = 46;

export const getTagMarqueeDuration = (
  trackWidth: number,
  pixelsPerSecond = MARQUEE_PIXELS_PER_SECOND,
) => {
  if (!Number.isFinite(trackWidth) || trackWidth <= 0 || pixelsPerSecond <= 0) {
    return DEFAULT_MARQUEE_DURATION_SECONDS;
  }

  return (trackWidth / 2 + MARQUEE_HALF_GAP_PX) / pixelsPerSecond;
};
