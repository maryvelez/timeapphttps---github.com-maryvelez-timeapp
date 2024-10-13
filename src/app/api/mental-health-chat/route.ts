import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log("API Key (first 5 chars):", process.env.OPENAI_API_KEY?.slice(0, 5));

  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is not set");
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  try {
    const { message } = await request.json();
    console.log("Received message:", message);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });

    console.log("OpenAI Response:", chatCompletion);

    const reply = chatCompletion.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error in OpenAI request:', error);

    if (error.response) {
      console.error('OpenAI API responded with:', error.response.status, error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else {
      console.error('Error details:', error.message);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}