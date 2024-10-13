
// /app/api/mental-health-chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { knowledgeBase } from '@/app/private/dashboard/mental-health/knowledgeBase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function findRelevantInformation(message: string): { info: string; source: string } | null {
  const lowercaseMessage = message.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      console.log(`Information retrieved from ementalhealth.ca - Article: ${item.source}`);
      return { info: item.information, source: item.source };
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is not set");
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  try {
    const { message } = await request.json();
    console.log("Received message:", message);

    const relevantInfo = findRelevantInformation(message);

    let systemPrompt = "You are a helpful mental health assistant. Provide a concise, supportive response in about two sentences. Do not mention ementalhealth.ca or any sources directly. You are smart and very motivating and want to give the best advice to the user. The user has a low self value, and needs motivation for alot of things, and actions, she could use a push and hard advice to face the truth";
    let userPrompt = message;

    if (relevantInfo) {
      systemPrompt += " Use the following information to inform your response, but summarize and personalize it:";
      userPrompt = `Information: ${relevantInfo.info}\n\nUser message: ${message}\n\nProvide a helpful, personalized response in about two sentences.`;
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 100,  // Increased slightly to allow for more nuanced responses
    });

    let reply = chatCompletion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

    console.log("Response generated using OpenAI and relevant information");

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error in mental health chat API:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}