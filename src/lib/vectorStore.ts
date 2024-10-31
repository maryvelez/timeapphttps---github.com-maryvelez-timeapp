// /lib/vectorStore.ts
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { Document } from 'langchain/document';
import { supabase } from './supabaseClient';

export async function createVectorStore(documents: Array<{
  information: string;
  source: string;
}>) {
  const docs = documents.map(
    (doc) =>
      new Document({
        pageContent: doc.information,
        metadata: { source: doc.source },
      })
  );

  const embeddings = new OpenAIEmbeddings();
  
  const vectorStore = await SupabaseVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    }
  );

  return vectorStore;
}

// /app/api/mental-health-chat/route.ts
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { createVectorStore } from '@/lib/vectorStore';
import { knowledgeBase } from '@/app/dashboard/mental-health/knowledgeBase';

const CONDENSE_PROMPT = PromptTemplate.fromTemplate(`
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone Question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(`
You are a compassionate mental health chatbot that helps users by providing accurate information from ementalhealth.ca. 
Use the following pieces of context to answer the question at the end. 
If you don't know the answer, just say that you don't know and suggest speaking with a mental health professional.
Always maintain a supportive and understanding tone.

Context: {context}

Question: {question}

Answer: `);

export async function POST(req: Request) {
  try {
    const { message, chatHistory = [] } = await req.json();
    
    const vectorStore = await createVectorStore(knowledgeBase);
    const model = new OpenAI({
      temperature: 0.2,
      modelName: 'gpt-4', // or gpt-3.5-turbo based on your needs
    });

    // Condense the question if there's chat history
    let condensedQuestion = message;
    if (chatHistory.length > 0) {
      const formattedHistory = chatHistory
        .map((msg: any) => `${msg.isUser ? 'Human' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      condensedQuestion = await model.call(
        await CONDENSE_PROMPT.format({
          chat_history: formattedHistory,
          question: message,
        })
      );
    }

    // Search for relevant documents
    const relevantDocs = await vectorStore.similaritySearch(condensedQuestion, 3);
    
    // Format the context from relevant documents
    const context = relevantDocs
      .map((doc) => `${doc.pageContent}\nSource: ${doc.metadata.source}`)
      .join('\n\n');

    // Generate the final response
    const response = await model.call(
      await QA_PROMPT.format({
        context,
        question: condensedQuestion,
      })
    );

    return new Response(JSON.stringify({ reply: response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat handler:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

