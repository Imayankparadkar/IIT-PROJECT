import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface ChatConversation {
  id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private conversations: Map<string, ChatConversation> = new Map();

  async sendMessage(userMessage: string, conversationId?: string): Promise<{ response: string; conversationId: string }> {
    try {
      // Get or create conversation
      const convId = conversationId || this.generateConversationId();
      let conversation = this.conversations.get(convId);
      
      if (!conversation) {
        conversation = {
          id: convId,
          messages: []
        };
        this.conversations.set(convId, conversation);
      }

      // Add user message to history
      conversation.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Create context-aware prompt
      const systemPrompt = `You are Park Sarthi Assistant, a helpful chatbot for a gamified parking management platform. 

Key features you can help with:
- Pre-slot parking booking (earn 50 points)
- Real-time parking availability
- Traffic challan checking and payment
- Vehicle document storage (License, RC, PUC)
- EV charging station locations with real-time availability
- Valet services and car maintenance
- FASTag services and recharge
- Gamification features (points system, levels, achievements, rewards)
- Business partnerships and solutions

Current parking locations in Indore:
- C21 Mall: 12 slots available, ₹20/hour
- Treasure Island Mall: 3 slots available, ₹25/hour  
- Orbit Mall: Full capacity, ₹30/hour

EV Charging Stations:
- Tata Power Station (0.5km): 4/6 ports available, ₹8/kWh
- BPCL Charging Hub (1.2km): 2/4 ports available, ₹7/kWh
- ChargePoint Station (2.3km): 1/3 ports available, ₹9/kWh

Gamification System:
- Bronze Parker: Level 1-2 (0-1999 points)
- Silver Parker: Level 3-4 (2000-3999 points)
- Gold Parker: Level 5-6 (4000-5999 points)
- Platinum Parker: Level 7+ (6000+ points)

Guidelines:
- Be friendly, helpful, and concise
- Provide actionable suggestions with specific details
- When users ask about parking, offer to help them find spots or book slots
- For challan queries, ask for vehicle number and offer checking service
- For EV stations, provide real-time availability and pricing
- Explain gamification benefits when relevant (earning points, achievements, rewards)
- Use emojis appropriately but sparingly
- Always offer to help with next steps

Previous conversation context: ${conversation.messages.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User question: ${userMessage}

Respond as Park Sarthi Assistant:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = result.response.text();

      // Add assistant response to history
      conversation.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      // Limit conversation history to last 20 messages
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }

      return { response, conversationId: convId };
    } catch (error) {
      console.error('Gemini API error:', error);
      const fallbackResponse = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team at support@myparkplus.com.";
      
      return { 
        response: fallbackResponse, 
        conversationId: conversationId || this.generateConversationId() 
      };
    }
  }

  private generateConversationId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getConversation(conversationId: string): ChatConversation | undefined {
    return this.conversations.get(conversationId);
  }

  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  // Clean up old conversations (run periodically)
  cleanupOldConversations(): void {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [id, conversation] of Array.from(this.conversations.entries())) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage && (now.getTime() - lastMessage.timestamp.getTime()) > maxAge) {
        this.conversations.delete(id);
      }
    }
  }
}

export const geminiService = new GeminiService();

// Clean up old conversations every hour
setInterval(() => {
  geminiService.cleanupOldConversations();
}, 60 * 60 * 1000);
