import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.gapgpt.app/v1",
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "There is not any message" },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gapgpt-qwen-3.5",
      messages: messages,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);

    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
