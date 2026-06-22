import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt, size, style } = await req.json();

    const finalPrompt = `${prompt}, ${style} style`;

    const response = await client.images.generate({
      model: "gapgpt/z-image",
      prompt: finalPrompt,
      size,
    });

    const imageUrl = response.data[0].url;

    return Response.json({
      image: imageUrl,
    });
  } catch (error) {
    return Response.json({ error: "Image generation failed" }, { status: 500 });
  }
}
