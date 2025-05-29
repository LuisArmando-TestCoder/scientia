import { CronJob } from "npm:cron";
import cronToHumanReadable from "./cronToHumanReadable.ts";
import log from "./log.ts";

/**
 * Schedules a given callback to run at the specified cron expression.
 *
 * @param callback - An async function that performs the scheduled task
 * @param cronTime - A string representing the cron schedule (e.g. "0 0 * * *" for midnight daily)
 *
 * Usage example:
 *   scheduleTasks(myFunction, "0 8 * * *"); // Runs daily at 08:00 UTC
 */
export default function scheduleTasks(
  callback: () => Promise<void> | void,
  cronTime: string
): typeof CronJob {
  log(
    `Scheduling newsletter process with cron expression: "${cronToHumanReadable(
      cronTime
    )}"`
  );

  // Create a new CronJob
  const job = new CronJob(
    cronTime,
    callback,
    null,
    false, // Don't start immediately
    "UTC"
  );


  // callback(); // todo: disable for prod or when testing endpoints

  // Start the CronJob
  job.start();
  console.log("Cron job started.");

  return job;
}
