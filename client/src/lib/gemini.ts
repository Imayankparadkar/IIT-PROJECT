import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDyVkm3-FSuaeh-TUXmjGZusxCUZB6U9aM";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class ParkSarthiChatbot {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private conversationHistory: ChatMessage[] = [];

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Create context-aware prompt
      const systemPrompt = `You are Park Sarthi Assistant, a helpful chatbot for a parking management platform. 

Key features you can help with:
- Pre-slot parking booking
- Real-time parking availability
- Traffic challan checking
- Vehicle document storage (License, RC, PUC)
- EV charging station locations
- Valet services
- FASTag services
- Gamification features (points, levels, rewards)

Guidelines:
- Be friendly, helpful, and concise
- Provide actionable suggestions
- When users ask about parking, offer to help them find spots or book slots
- For challan queries, ask for vehicle number
- For EV stations, ask for current location
- Explain gamification benefits when relevant
- Use emojis appropriately but sparingly

User question: ${userMessage}

Previous conversation context: ${this.conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Respond as Park Sarthi Assistant:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = result.response.text();

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team.";
    }
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export const chatbot = new ParkSarthiChatbot();
