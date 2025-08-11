import { NextResponse } from "next/server";
import { 
  aiService, 
  dbService, 
  genAI, 
  embeddingModel, 
  collections 
} from "../../../../lib/datastax";

const MAX_MESSAGE_LENGTH = 8000;

export async function POST(request) {
  try {
    const { message, chatId } = await request.json();

    // Validate message
    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // Save user message (auto-handles compression if needed)
    const requestsCollection = collections.chats;
    const userDoc = {
      message: message.length > MAX_MESSAGE_LENGTH 
        ? message.substring(0, MAX_MESSAGE_LENGTH - 100) + '... [TRUNCATED]' 
        : message,
      chatId: chatId || `chat-${Date.now()}`,
      type: 'user_message',
      wasTruncated: message.length > MAX_MESSAGE_LENGTH
    };

    await dbService.saveChat(requestsCollection, userDoc);

    // Generate embedding
    const vector = await aiService.generateEmbedding(
      embeddingModel, 
      userDoc.message // Use the stored message (may be truncated)
    );

    // Perform vector search
    const searchResults = await dbService.vectorSearch(
      collections.data,
      vector,
      5
    );

    // Format context
    const context = searchResults.map((doc) => doc.text).join("\n\n");

    // Get AI response
    const responseText = await aiService.getAIResponse(genAI, message, context);

    // Save AI response (will auto-compress if needed)
    await dbService.saveChat(requestsCollection, {
      message: responseText,
      chatId: chatId || userDoc.chatId,
      type: 'ai_response',
      context: context.length > 0 ? 'context_available' : 'no_context'
    });

    return NextResponse.json({ 
      message: responseText,
      chatId: userDoc.chatId,
      hasContext: context.length > 0,
      warning: userDoc.wasTruncated 
        ? 'Your message was truncated due to length limits' 
        : undefined
    });
    
  } catch (error) {
    console.error("API Error:", error);
    
    if (error.message.includes('Document size limitation')) {
      return NextResponse.json(
        { error: "Message too large to process" },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "CeloKit AI Chat API" }, { status: 200 });
}