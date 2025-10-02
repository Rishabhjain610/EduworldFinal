// import { prevUser } from "./UserContextChat";
// const Api_Url = import.meta.env.VITE_GEMINI_API_URL; // Replace with your actual API URL
// console.log(Api_Url);
// export async function generateResponse() {
//   let RequestOption = {
//     method: "POST",
//     Headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             { text: prevUser.prompt },
//             prevUser.data
//               ? [
//                   {
//                     inline_data: {
//                       mime_type: prevUser.mime_type,
//                       data: prevUser.data,
//                     },
//                   },
//                 ]
//               : [],
//           ],
//         },
//       ],
//     }),
//   };
//   try {
//     let response = await fetch(Api_Url, RequestOption);
//     let data = await response.json();
//     let apiResponse = data.candidates[0].content.parts[0].text
//       .replace(/\*\*(.*?)\*\*/g, "$1")
//       .trim();
//     console.log(apiResponse);
//     return apiResponse;
//   } catch {
//     console.error();
//   }
// }

import { prevUser } from "./UserContextChat";

const API_KEY = import.meta.env.VITE_GEMINI_API_URL; // Replace with your actual API key
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildParts() {
  const parts = [];

  if (prevUser?.prompt) parts.push({ text: String(prevUser.prompt) });

  if (prevUser?.data) {
    const mime = (prevUser.mime_type || "").toLowerCase();
    if (!mime || mime.startsWith("text") || (typeof prevUser.data === "string" && !mime.startsWith("image"))) {
      parts.push({ text: String(prevUser.data) });
    } else {
      parts.push({
        inline_data: {
          mime_type: prevUser.mime_type,
          data: prevUser.data.replace(/^data:[^;]+;base64,/, ""),
        },
      });
    }
  }

  return parts;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function callGenAI(payload, timeoutMs, signal) {
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
    signal,
  };
  const res = await fetch(API_URL, opts);
  const raw = await res.text();
  return { res, raw };
}

export async function generateResponse({
  timeoutMs = 45000,
  maxRetries = 5,
  baseDelay = 1000, // ms
} = {}) {
  const parts = buildParts();
  if (parts.length === 0) return "No prompt or data provided.";

  const payload = { contents: [{ parts }] };

  // Exponential backoff + jitter retry loop for 503/429 transient errors
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    if (controller) {
      setTimeout(() => controller.abort(), timeoutMs);
    }

    try {
      const { res, raw } = await callGenAI(payload, timeoutMs, controller ? controller.signal : undefined);
      console.log(`[GenAI] attempt ${attempt} status:`, res.status, "body:", raw);

      if (res.ok) {
        let data;
        try {
          data = JSON.parse(raw);
        } catch (e) {
          throw new Error("Invalid JSON response from GenAI");
        }

        const candidate = data?.candidates?.[0];
        if (!candidate) return "No response from model.";

        const contentParts = candidate.content?.parts || [];
        let textPart = contentParts.find((p) => typeof p.text === "string" && p.text.trim().length > 0);
        if (!textPart && contentParts.length && typeof contentParts[0].text === "string") textPart = contentParts[0];

        let apiResponse = textPart?.text ?? "";
        apiResponse = apiResponse.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        if (!apiResponse && candidate?.content) apiResponse = JSON.stringify(candidate.content).slice(0, 2000);

        return apiResponse || "Model returned empty response.";
      }

      // Handle transient server-side/unavailable errors: retry
      if (res.status === 503 || res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (attempt === maxRetries) {
          // exhausted retries
          return `Service temporarily unavailable (status ${res.status}). Please try again later.`;
        }
        // Exponential backoff with jitter
        const jitter = Math.floor(Math.random() * 300);
        const delay = Math.pow(2, attempt) * baseDelay + jitter;
        console.warn(`[GenAI] transient error ${res.status}. retrying in ${delay}ms (attempt ${attempt + 1})`);
        await sleep(delay);
        continue;
      }

      // Non-retryable error: surface message
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (_) {
        parsed = raw;
      }
      return `GenAI error ${res.status}: ${parsed}`;
    } catch (err) {
      // network / abort errors: treat as transient up to retries
      console.error(`[generateResponse] network/abort error on attempt ${attempt}:`, err?.message || err);
      if (err.name === "AbortError") {
        if (attempt === maxRetries) return "Request timed out.";
      }
      if (attempt === maxRetries) return `Error: ${err.message || "failed to contact GenAI"}`;
      const jitter = Math.floor(Math.random() * 300);
      const delay = Math.pow(2, attempt) * baseDelay + jitter;
      await sleep(delay);
      continue;
    }
  }

  return "Failed to get response from GenAI after multiple attempts.";
}
// ...existing code...