import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");
    const scale = formData.get("scale") || "4x";

    if (!file) {
      return Response.json({ error: "No image uploaded" }, { status: 400 });
    }

    // تبدیل فایل به ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // درخواست به مدل
    const response = await client.images.generate({
      model: "gapgpt/z-image",
      prompt: `Upscale this image to ${scale}, ultra high resolution`,
      image: buffer,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    return Response.json({
      image: imageUrl,
    });
  } catch (error) {
    console.error("Upscale error:", error);

    return Response.json({ error: "Image upscale failed" }, { status: 500 });
  }
}
