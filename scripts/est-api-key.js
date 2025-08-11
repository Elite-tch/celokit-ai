// scripts/est-api-key.js - ES Module version
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testAPI() {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Testing Gemini API Connection...');
  console.log('API Key exists:', !!API_KEY);
  console.log('API Key starts with AIza:', API_KEY?.startsWith('AIza') ? '✅ Yes' : '❌ No');
  
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('📝 Make sure your .env.local file contains:');
    console.log('   GEMINI_API_KEY=AIzaSyBqbVW_KrNmiiCWDSfS6cRPq0iufBwkBN8');
    console.log('📁 File should be located at: .env.local (in project root)');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test 1: Simple text generation
    console.log('\n🧪 Test 1: Text Generation...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say hello in one sentence");
    console.log('✅ Text generation successful:', result.response.text());
    
    // Test 2: Embedding generation
    console.log('\n🧪 Test 2: Embedding Generation...');
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResponse = await embeddingModel.embedContent("test text for embedding");
    console.log('✅ Embedding generation successful!');
    console.log('   Vector length:', embeddingResponse.embedding.values.length);
    console.log('   First few values:', embeddingResponse.embedding.values.slice(0, 5));
    
    console.log('\n🎉 All tests passed! Your API is working correctly.');
    console.log('🔧 Your original embedding error should now be resolved.');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:', error.message);
    
    if (error.message.includes('fetch failed')) {
      console.log('💡 Network connectivity issue detected');
      console.log('   - This might be a temporary Google API issue');
      console.log('   - Try again in a few minutes');
      console.log('   - Check if your network blocks external API calls');
    } else if (error.message.includes('API_KEY') || error.message.includes('invalid')) {
      console.log('💡 API key issue detected');
      console.log('   - Double-check your API key in .env.local');
      console.log('   - Make sure there are no extra spaces or characters');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('💡 API quota/limit issue');
      console.log('   - You might have exceeded your API quota');
      console.log('   - Check your Google Cloud Console for usage');
    } else {
      console.log('💡 Unexpected error. Full error details:');
      console.error(error);
    }
  }
}

console.log('Starting API test...');
testAPI().catch(console.error);