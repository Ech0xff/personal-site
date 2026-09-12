import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

const DEFAULT_TIME_ZONE = "America/New_York";
const DEFAULT_LOCALE = "en";

dayjs.extend(utc);
dayjs.extend(timezone);

/** The application's default time zone */
export const APP_TIME_ZONE = (() => {
  const envTimeZone =
    process.env.NEXT_PUBLIC_APP_TIMEZONE || process.env.APP_TIMEZONE;

  try {
    dayjs.tz("2026-01-01 00:00", envTimeZone);
    dayjs.tz.setDefault(envTimeZone);
    return envTimeZone;
  } catch {
    dayjs.tz.setDefault(DEFAULT_TIME_ZONE);
    return DEFAULT_TIME_ZONE;
  }
})();

const toDayjs = (dateInput: string | Date | null | undefined) => {
  if (!dateInput) return null;
  const date = dayjs(dateInput).tz(APP_TIME_ZONE);
  return date.isValid() ? date : null;
};

/** Formats a date input into a human-readable string */
export const formatTime = (
  dateInput: string | Date | null | undefined,
  format = "MMM D, YYYY",
  fallback = "—",
) => {
  const date = toDayjs(dateInput);
  if (!date) return fallback;
  return date.locale(DEFAULT_LOCALE).format(format);
};

/** Converts a date input to a local datetime string suitable for input[type="datetime-local"] */
export const toDatetimeLocalValue = (
  dateInput: string | Date | null | undefined,
) => {
  const date = toDayjs(dateInput);
  if (!date) return "";

  return date.format("YYYY-MM-DDTHH:mm");
};

/** Converts a datetime-local string in app timezone to UTC ISO string */
export const datetimeLocalToUtcIso = (
  dateInput: string | null | undefined,
  fallback = "",
) => {
  if (!dateInput) return fallback;

  const date = dayjs.tz(dateInput, APP_TIME_ZONE);
  if (!date.isValid()) return fallback;

  return date.utc().toISOString();
};
