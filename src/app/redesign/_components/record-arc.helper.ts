export const recordArc = {
  center: 120,
  radius: 65,
  start: 150,
  sweep: -120,
} as const;

export function arcPoint(progress: number) {
  const radians =
    ((recordArc.start + recordArc.sweep * progress) * Math.PI) / 180;
  return {
    x: recordArc.center + recordArc.radius * Math.cos(radians),
    y: recordArc.center + recordArc.radius * Math.sin(radians),
  };
}

export function arcProgress(x: number, y: number): number {
  const pointerAngle =
    (Math.atan2(y - recordArc.center, x - recordArc.center) * 180) / Math.PI;
  const angle = pointerAngle < -90 ? pointerAngle + 360 : pointerAngle;
  return Math.max(0, Math.min(1, (recordArc.start - angle) / -recordArc.sweep));
}
