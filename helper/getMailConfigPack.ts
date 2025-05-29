import nodemailer from "npm:nodemailer";
import { Config, EmailConfig, MailConfigPack, NewsSource } from "../types.ts";
import errorLog from "./errorLog.ts";
import { getFallBackAuth } from "../db/auth/getFallBackAuth.ts";

// Helper: Validate and create a mail configuration pack.
export default async (
  config?: Config,
  newsSource?: NewsSource
): Promise<MailConfigPack> => {
  const { emailConfig } = await getFallBackAuth(config, newsSource);
  const {
    auth,
    host,
    senderName,
    senderEmail,
    newsletterSubject = "Translated Articles",
  } = emailConfig;
  if (!host || !auth?.user || !auth?.pass) {
    errorLog("Email configuration is incomplete. Check config.json.");
    Deno.exit(1);
  }
  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false, // true for port 465.
    auth,
  });
  return {
    host,
    auth,
    senderName,
    senderEmail,
    newsletterSubject,
    transporter,
  };
};
