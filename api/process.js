import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { transcript, type } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript missing" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt =
      type === "seo"
        ? `Write a detailed, SEO-optimized blog post based on: ${transcript}`
        : `Write a short, concise blog based on: ${transcript}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiOutput = completion.choices[0].message.content;
    res.status(200).json({ full_text: aiOutput });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
