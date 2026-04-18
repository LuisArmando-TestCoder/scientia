import { OpenRouter } from "npm:@openrouter/sdk";
const openRouter = new OpenRouter({ apiKey: "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" });
const comp = await openRouter.chat.send({
  model: "google/gemini-3-flash-preview",
  messages: [{ role: "user", content: "hi" }]
});
console.log(comp.choices[0].message.content);
