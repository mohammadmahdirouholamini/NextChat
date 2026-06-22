import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const {
      text,
      voice = "alloy",
      format = "mp3",
      speed = 1,
    } = await req.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      format,
      speed,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": `audio/${format}`,
        "Content-Disposition": `inline; filename=speech.${format}`,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Speech generation failed" },
      { status: 500 },
    );
  }
}
