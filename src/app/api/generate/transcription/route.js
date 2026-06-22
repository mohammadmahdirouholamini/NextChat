import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "Audio file required" }, { status: 400 });
    }

    // optional validation
    if (!file.type?.startsWith("audio")) {
      return Response.json({ error: "Invalid audio file" }, { status: 400 });
    }

    const transcription = await client.audio.transcriptions.create({
      file: file,
      model: "gapgpt/whisper-1",
    });

    return Response.json({
      text: transcription?.text || "",
    });
  } catch (error) {
    console.error("Transcription error:", error);

    return Response.json(
      {
        error: error.message || "Transcription failed",
      },
      { status: 500 },
    );
  }
}
