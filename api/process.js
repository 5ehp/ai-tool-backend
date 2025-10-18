import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const body = req.body && typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const userText = body?.text || "";
    const type = body?.type || "summarize";
    const language = body?.language || "English";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let prompt = "";
    if (type === "summarize") {
      prompt = `Summarize this text in a clear and short way:\n\n${userText}`;
    } else if (type === "rewrite") {
      prompt = `Rewrite this text in a natural, human-friendly tone:\n\n${userText}`;
    } else if (type === "translate") {
      prompt = `Translate the following text into ${language}:\n\n${userText}`;
    } else {
      prompt = userText;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const resultText = completion.choices?.[0]?.message?.content || "";
    res.status(200).json({ result: resultText });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
