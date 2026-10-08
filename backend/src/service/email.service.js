import MailComposer from "nodemailer/lib/mail-composer/index.js";
import config from "../config/config.js";

/**
 * Sends email through the Gmail API over HTTPS (port 443).
 *
 * Why not SMTP: many free hosts (e.g. Render free tier) block outbound SMTP
 * ports, which made the old nodemailer "gmail" transport hang. This version
 * uses the same credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN,
 * EMAIL_USER) and works both locally and in production.
 *
 * Requirement: the Gmail API must be enabled in your Google Cloud project.
 */

const REQUEST_TIMEOUT_MS = 15000;
let cachedToken = { value: null, expiresAt: 0 };

async function getAccessToken() {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60 * 1000) {
    return cachedToken.value;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      refresh_token: config.REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.access_token) {
    throw new Error(
      `Google token request failed (${res.status}): ${data.error || "unknown"} ${data.error_description || ""}`.trim(),
    );
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return cachedToken.value;
}

function buildRawMessage(options) {
  const mail = new MailComposer(options);
  return new Promise((resolve, reject) => {
    mail.compile().build((error, message) => {
      if (error) return reject(error);
      resolve(message.toString("base64url"));
    });
  });
}

// Function to send email (same signature as before)
const sendEmail = async (to, subject, text, html) => {
  try {
    const raw = await buildRawMessage({
      from: `"Ankit Kumar" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        `Gmail API error (${res.status}): ${data?.error?.message || "unknown"}`,
      );
    }

    console.log("Email sent:", data.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export default sendEmail;;
