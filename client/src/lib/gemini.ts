import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  imageType?: string;
}

export class ParkSarthiChatbot {
  private model = API_KEY ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
  private conversationHistory: ChatMessage[] = [];

  async sendMessage(userMessage: string): Promise<string> {
    try {
      if (!this.model || !API_KEY) {
        return "AI chatbot is currently unavailable. Please ensure the Gemini API key is configured.";
      }
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Extract language preference from message
      const languageMatch = userMessage.match(/\[User's preferred language: ([^\]]+)\]/);
      const preferredLanguage = languageMatch ? languageMatch[1] : 'English';
      const cleanMessage = userMessage.replace(/\[User's preferred language: [^\]]+\]\s*/, '');
      
      // Extract image context
      const imageMatch = cleanMessage.match(/\[User uploaded an image: ([^\]]+)\]/);
      const hasImage = imageMatch ? imageMatch[1] : null;
      const finalMessage = cleanMessage.replace(/\[User uploaded an image: [^\]]+\]\s*/, '');

      // Create context-aware prompt
      const systemPrompt = `You are Park Sarthi Assistant, a multilingual helpful chatbot for a gamified parking management platform.

CURRENT USER LANGUAGE: ${preferredLanguage}
IMPORTANT: Respond in ${preferredLanguage} language. If it's Hindi, use Devanagari script. If Tamil, use Tamil script. Match the user's language preference exactly.

Key features you can help with:
- Pre-slot parking booking (earn 50 points per booking)
- Real-time parking availability across Indore
- Traffic challan checking and payment
- Vehicle document storage (License, RC, PUC)
- EV charging station locations with live status
- Valet services and car maintenance
- FASTag services and recharge
- Gamification features (points system, levels, achievements, rewards)
- Business partnerships and franchise opportunities

Current Indore Parking Status:
- C21 Mall: 12/50 slots available, ₹20/hour, EV charging available
- Treasure Island Mall: 3/30 slots available, ₹25/hour
- Orbit Mall: Full capacity (0/40), ₹30/hour
- Phoenix Citadel: 8/25 slots available, ₹35/hour, valet service
- DB City Mall: 15/60 slots available, ₹18/hour

EV Charging Network:
- Tata Power Station (Vijay Nagar): 4/6 ports available, ₹8/kWh
- BPCL Charging Hub (Palasia): 2/4 ports available, ₹7/kWh
- ChargePoint Station (Ring Road): 1/3 ports available, ₹9/kWh

Gamefication Levels:
- Bronze Parker (Level 1-2): 0-1999 points, basic features
- Silver Parker (Level 3-4): 2000-3999 points, 5% discount
- Gold Parker (Level 5-6): 4000-5999 points, 10% discount + priority booking
- Platinum Parker (Level 7+): 6000+ points, 15% discount + valet access

${hasImage ? `\nIMAGE CONTEXT: User uploaded an image (${hasImage}). Analyze it for parking, vehicle, or traffic-related content and provide relevant assistance.` : ''}

Guidelines:
- Always respond in ${preferredLanguage}
- Be friendly, helpful, and culturally appropriate
- Provide specific parking recommendations with real data
- For challan queries, ask for vehicle number and offer instant checking
- For EV stations, provide live availability and directions
- Explain points earning opportunities
- Use appropriate regional references for Indian users
- Include emojis that work well in ${preferredLanguage} context

User question: ${finalMessage}

Previous conversation context: ${this.conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Respond as Park Sarthi Assistant in ${preferredLanguage}:`;

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
      // Return error message in appropriate language
      const languageMatch = userMessage.match(/\[User's preferred language: ([^\]]+)\]/);
      const preferredLanguage = languageMatch ? languageMatch[1] : 'English';
      
      const errorMessages = {
        'English': "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team.",
        'Hindi (हिन्दी)': "क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया थोड़ी देर बाद पुनः प्रयास करें या हमारी सहायता टीम से संपर्क करें।",
        'Tamil (தமிழ்)': "மன்னிக்கவும், எனக்கு இப்போது இணைப்பதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும் அல்லது எங்கள் ஆதரவு குழுவைத் தொடர்பு கொள்ளவும்।",
        'Marathi (मराठी)': "क्षमा करा, मला आत्ता जोडण्यात अडचण येत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा किंवा आमच्या सहाय्य संघाशी संपर्क साधा.",
        'Gujarati (ગુજરાતી)': "માફ કરશો, મને અત્યારે કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને થોડી વારે ફરી પ્રયાસ કરો અથવા અમારી સહાય ટીમનો સંપર્ક કરો."
      };
      
      return errorMessages[preferredLanguage as keyof typeof errorMessages] || errorMessages['English'];
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
