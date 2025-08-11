import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gzipSync, gunzipSync } from 'node:zlib';

const {
  GEMINI_API_KEY,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
} = process.env;

// Validate environment variables
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN || !GEMINI_API_KEY) {
  throw new Error("Missing required environment variables");
}

// Initialize clients
function initClients() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
  const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

  return {
    genAI,
    embeddingModel,
    db,
    collections: {
      data: db.collection(ASTRA_DB_COLLECTION),
      chats: db.collection("celokit_knowledge"),
      embeddingModel
    },
  };
}

// Database Service with compression support
export const dbService = {
  async vectorSearch(collection, vector, limit = 5) {
    const searchResults = collection.find(null, {
      sort: { $vector: vector },
      limit,
    });
    return await searchResults.toArray();
  },

  async saveChat(collection, chatData) {
    const MAX_SIZE = 8000;
    const { message, ...rest } = chatData;

    // Compress if message is too large
    if (message.length > MAX_SIZE) {
      return this.saveCompressedChat(collection, chatData);
    }

    const result = await collection.insertOne({
      ...rest,
      message,
      createdAt: new Date().toISOString(),
    });
    return result.insertedId;
  },

  async saveCompressedChat(collection, chatData) {
    const compressedMessage = gzipSync(Buffer.from(chatData.message)).toString('base64');
    const result = await collection.insertOne({
      ...chatData,
      message: compressedMessage,
      isCompressed: true,
      createdAt: new Date().toISOString(),
    });
    return result.insertedId;
  },

  async getChatHistory(collection, limit = 50) {
    const chats = await collection.find({}, {
      sort: { createdAt: -1 },
      limit,
    }).toArray();

    return chats.map(chat => {
      if (chat.isCompressed) {
        return {
          ...chat,
          message: gunzipSync(Buffer.from(chat.message, 'base64')).toString()
        };
      }
      return chat;
    });
  },
};

// AI Service
export const aiService = {
  async generateEmbedding(embeddingModel, text) {
    if (!embeddingModel) throw new Error('Embedding model not initialized');
    const embeddingResponse = await embeddingModel.embedContent(text);
    return embeddingResponse.embedding.values;
  },

  async getAIResponse(genAI, message, context) {
    const systemInstruction = `You are CeloKit AI...`; // Your existing instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction,
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    return result.response.text();
  },
};

// Initialize and export clients
const { genAI, embeddingModel, db, collections } = initClients();
export { genAI, embeddingModel, db, collections };