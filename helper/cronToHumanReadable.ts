/**
 * Checks if the given field is a wildcard ("*").
 */
function isWildcard(field: string): boolean {
  return field === "*";
}

/**
 * Checks if the field represents an interval (e.g. "*\/N" or "0/N").
 */
function isInterval(field: string): boolean {
  return field.startsWith("*/") || field.startsWith("0/");
}

/**
 * Formats the provided hour and minute (as strings) into 12-hour time.
 */
function formatTime(hourStr: string, minuteStr: string): string {
  const h = parseInt(hourStr, 10);
  const m = parseInt(minuteStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Maps a day-of-week value to its name.
 */
function mapDow(dow: string): string {
  const mapping: Record<string, string> = {
    "0": "Sunday",
    "7": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
  };
  return mapping[dow] || dow;
}

/**
 * Returns true if the expression represents "every minute".
 */
function isEveryMinute(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string
): boolean {
  return (
    (minute === "*/1" || minute === "0/1" || isWildcard(minute)) &&
    isWildcard(hour) &&
    isWildcard(dom) &&
    isWildcard(month) &&
    isWildcard(dow)
  );
}

/**
 * Returns true if the expression represents "every N minutes".
 */
function isEveryNMinutes(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string
): boolean {
  return (
    isInterval(minute) &&
    isWildcard(hour) &&
    isWildcard(dom) &&
    isWildcard(month) &&
    isWildcard(dow)
  );
}

/**
 * Returns true if the expression fixes only the minute and leaves hour and others wild.
 */
function isHourly(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string
): boolean {
  return (
    !isWildcard(minute) &&
    isWildcard(hour) &&
    isWildcard(dom) &&
    isWildcard(month) &&
    isWildcard(dow)
  );
}

/**
 * Returns true if the expression represents a daily schedule.
 * (day-of-month, month, and day-of-week are wildcards)
 */
function isDaily(dom: string, month: string, dow: string): boolean {
  return isWildcard(dom) && isWildcard(month) && isWildcard(dow);
}

/**
 * Returns true if the expression represents a weekly schedule.
 * (day-of-month and month are wildcards, but day-of-week is fixed)
 */
function isWeekly(dom: string, month: string, dow: string): boolean {
  return isWildcard(dom) && isWildcard(month) && !isWildcard(dow);
}

/**
 * Returns true if the expression represents a monthly schedule.
 * (Month and day-of-week are wildcards, but day-of-month is fixed)
 */
function isMonthly(dom: string, month: string, dow: string): boolean {
  return !isWildcard(dom) && isWildcard(month) && isWildcard(dow);
}

/**
 * Returns true if every field is fixed (a specific date/time).
 */
function isSpecific(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string
): boolean {
  return (
    !isWildcard(minute) &&
    !isWildcard(hour) &&
    !isWildcard(dom) &&
    !isWildcard(month) &&
    !isWildcard(dow)
  );
}

/**
 * Converts a standard 5-field cron expression into a human-readable string.
 *
 * Examples:
 * - "0 1 * * *"      → "Every day at 1:00 AM"
 * - "*\/1 * * * *"    → "Every minute"
 * - "0/2 * * * *"    → "Every 2 minutes"
 * - "30 14 * * *"    → "Every day at 2:30 PM"
 * - "0 0 * * 0"      → "Every week on Sunday at 12:00 AM"
 * - "0 0 1 * *"      → "Every month on day 1 at 12:00 AM"
 *
 * @param cron The cron expression string (5 fields).
 * @returns A human-readable description.
 */
export default function cronToHumanReadable(cron: string): string {
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5) return cron; // Fallback if not a standard cron

  const [minute, hour, dom, month, dow] = fields;

  if (isEveryMinute(minute, hour, dom, month, dow)) {
    return "Every minute";
  }

  if (isEveryNMinutes(minute, hour, dom, month, dow)) {
    const interval = minute.split("/")[1];
    return `Every ${interval} minutes`;
  }

  if (isHourly(minute, hour, dom, month, dow)) {
    return `At minute ${minute} past every hour`;
  }

  if (isDaily(dom, month, dow)) {
    return `Every day at ${formatTime(hour, minute)}`;
  }

  if (isWeekly(dom, month, dow)) {
    return `Every week on ${mapDow(dow)} at ${formatTime(hour, minute)}`;
  }

  if (isMonthly(dom, month, dow)) {
    return `Every month on day ${dom} at ${formatTime(hour, minute)}`;
  }

  if (isSpecific(minute, hour, dom, month, dow)) {
    return `At ${formatTime(
      hour,
      minute
    )} on day ${dom} of month ${month} (and day-of-week ${dow})`;
  }

  // Fallback to the original cron expression if no pattern matches.
  return cron;
}
