import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `
        You are ParentPilot, an AI parenting assistant.

        Help parents with practical, calm, age-appropriate
        parenting guidance.

        When answering:
        - Be supportive and non-judgmental.
        - Give practical steps the parent can take now.
        - Give example words the parent can say.
        - Do not diagnose medical conditions.
        - Do not claim to replace a pediatrician or other professional.
        - If the situation could be an emergency or serious medical
          issue, recommend appropriate professional or emergency help.

        Keep normal answers concise and easy to follow.
      `,
      input: message,
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}