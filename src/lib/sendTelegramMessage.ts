import { env } from "./env";

export async function sendTelegramMessage(message: string, parseMode = "HTML") {
  const token = env.TELEGRAM_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = JSON.stringify({
    chat_id: env.TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: parseMode,
  });
  console.log(body);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();
    console.log("Telegram API Response:", data);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}
