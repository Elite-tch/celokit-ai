// scripts/seedCeloData.js
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { celoKnowledgeBase , celoCodeExamples } from "../lib/celoKnowledge.js";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const {
  GEMINI_API_KEY,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
} = process.env;

// Initialize the client and model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env.local");
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// Create collection for Celo knowledge
const createCollection = async () => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 768,
        metric: "dot_product",
      },
    });
    console.log("✅ Collection created:", res);
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Collection already exists");
    } else {
      throw error;
    }
  }
};

// Test connection
const testConnection = async () => {
  try {
    const colls = await db.listCollections();
    console.log("✅ Connected to AstraDB. Collections:", colls.map(c => c.name));
  } catch (error) {
    console.error("❌ Failed to connect to AstraDB:", error);
    throw error;
  }
};

// Celo documentation and resource URLs
const celoDocumentationUrls = [
  "https://docs.celo.org/",
  "https://docs.celo.org/developer/walkthrough",
  "https://docs.celo.org/developer/deploy/hardhat",
  "https://docs.celo.org/developer/deploy/remix", 
  "https://docs.celo.org/integration/wallets",
  "https://docs.celo.org/integration/checklist",
  "https://docs.celo.org/protocol/consensus/validator-guide",
  "https://docs.celo.org/celo-codebase/protocol/transactions/gas-pricing",
  "https://docs.celo.org/celo-codebase/protocol/identity",
];

// Scrape documentation pages
const scrapePage = async (url) => {
  try {
    console.log(`🔍 Scraping: ${url}`);
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      },
      evaluate: async (page, browser) => {
        try {
          const content = await page.evaluate(() => {
            // Remove script and style elements
            const scripts = document.querySelectorAll('script, style, nav, footer, header');
            scripts.forEach(el => el.remove());
            
            // Get main content
            const main = document.querySelector('main, .content, article, .docs-content');
            return main ? main.innerText : document.body.innerText;
          });
          
          await browser.close();
          return content;
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          await browser.close();
          return '';
        }
      },
    });
    
    const content = await loader.scrape();
    return content?.replace(/<[^>]*>?/gm, "").trim() || '';
  } catch (error) {
    console.error(`❌ Failed to scrape ${url}:`, error.message);
    return '';
  }
};

// Load manual knowledge base
const loadManualKnowledge = async () => {
  console.log("📚 Loading manual Celo knowledge base...");
  const collection = db.collection(ASTRA_DB_COLLECTION);

  for (const item of celoKnowledgeBase) {
    try {
      const chunks = await splitter.splitText(item.content);
      
      for (const chunk of chunks) {
        const combinedText = `${item.topic}: ${chunk}`;
        const resultEmbedding = await model.embedContent(combinedText);
        
        const res = await collection.insertOne({
          $vector: resultEmbedding.embedding.values,
          text: combinedText,
          topic: item.topic,
          source: 'manual_knowledge',
          type: 'documentation',
        });
        
        console.log(`✅ Inserted knowledge chunk for: ${item.topic}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${item.topic}:`, error);
    }
  }
};

// Load code examples
const loadCodeExamples = async () => {
  console.log("💻 Loading Celo code examples...");
  const collection = db.collection(ASTRA_DB_COLLECTION);

  for (const [key, code] of Object.entries(celoCodeExamples)) {
    try {
      const chunks = await splitter.splitText(code);
      
      for (const chunk of chunks) {
        const combinedText = `Celo ${key} code example: ${chunk}`;
        const resultEmbedding = await model.embedContent(combinedText);
        
        const res = await collection.insertOne({
          $vector: resultEmbedding.embedding.values,
          text: combinedText,
          topic: key,
          source: 'code_examples',
          type: 'code',
        });
        
        console.log(`✅ Inserted code example: ${key}`);
      }
    } catch (error) {
      console.error(`❌ Error processing code example ${key}:`, error);
    }
  }
};

// Load documentation from web
const loadWebDocumentation = async () => {
  console.log("🌐 Loading Celo documentation from web...");
  const collection = db.collection(ASTRA_DB_COLLECTION);
  
  for (const url of celoDocumentationUrls) {
    try {
      const content = await scrapePage(url);
      
      if (!content || content.length < 100) {
        console.log(`⚠️  Skipping ${url} - insufficient content`);
        continue;
      }
      
      const chunks = await splitter.splitText(content);
      
      for (const chunk of chunks) {
        if (chunk.trim().length < 50) continue; // Skip very short chunks
        
        const combinedText = `Celo documentation from ${url}: ${chunk}`;
        const resultEmbedding = await model.embedContent(combinedText);
        
        const res = await collection.insertOne({
          $vector: resultEmbedding.embedding.values,
          text: combinedText,
          url: url,
          source: 'web_documentation',
          type: 'documentation',
        });
      }
      
      console.log(`✅ Processed ${url} - ${chunks.length} chunks`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error processing ${url}:`, error.message);
    }
  }
};

// Add RainbowKit and Wagmi specific knowledge
const loadWalletKnowledge = async () => {
  console.log("🌈 Loading wallet integration knowledge...");
  const collection = db.collection(ASTRA_DB_COLLECTION);
  
  const walletKnowledge = [
    {
      topic: "RainbowKit Celo Configuration",
      content: `
      RainbowKit configuration for Celo:
      
      import { getDefaultConfig } from '@rainbow-me/rainbowkit';
      import { celo, celoAlfajores } from 'viem/chains';
      
      const config = getDefaultConfig({
        appName: 'Celo App',
        projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
        chains: [celoAlfajores, celo],
        ssr: true,
      });
      
      Custom Celo theme:
      <RainbowKitProvider theme={{
        accentColor: '#35D07F',
        accentColorForeground: 'white',
      }}>
      `
    },
    {
      topic: "Wagmi Celo Hooks",
      content: `
      Essential Wagmi hooks for Celo development:
      
      // Balance checking with token support
      const { data: celoBalance } = useBalance({ address, chainId: celo.id });
      const { data: cusdBalance } = useBalance({ 
        address, 
        token: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
        chainId: celo.id 
      });
      
      // Writing contracts with proper gas settings
      const { writeContract } = useWriteContract();
      
      // Network switching between Alfajores and Mainnet
      const { switchChain } = useSwitchChain();
      `
    }
  ];
  
  for (const item of walletKnowledge) {
    const resultEmbedding = await model.embedContent(item.content);
    
    await collection.insertOne({
      $vector: resultEmbedding.embedding.values,
      text: item.content,
      topic: item.topic,
      source: 'wallet_integration',
      type: 'code_documentation',
    });
    
    console.log(`✅ Added wallet knowledge: ${item.topic}`);
  }
};

// Main execution function
const seedCeloKnowledge = async () => {
  console.log("🚀 Starting Celo knowledge base seeding...");
  
  try {
    // Test connection first
    await testConnection();
    
    // Create collection
    await createCollection();
    
    // Load different types of knowledge
    await loadManualKnowledge();
    await loadCodeExamples();
    await loadWalletKnowledge();
    
    // Uncomment to load web documentation (takes longer)
    // await loadWebDocumentation();
    
    console.log("✅ Celo knowledge base seeding completed successfully!");
    
    // Verify the data
    const collection = db.collection(ASTRA_DB_COLLECTION);
    const sampleDocs = await collection.find({}).limit(5).toArray();
    console.log("📊 Sample documents in collection:", sampleDocs.length);
    
  } catch (error) {
    console.error("❌ Error seeding Celo knowledge:", error);
    process.exit(1);
  }
};

// Run the seeding
seedCeloKnowledge();