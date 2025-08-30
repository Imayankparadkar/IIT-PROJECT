import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { chatbot, type ChatMessage } from '@/lib/gemini';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Park Sarthi assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get bot response from Gemini
      const botResponse = await chatbot.sendMessage(userMessage);
      
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-bubble">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors gamification-pulse shadow-lg"
        data-testid="button-toggle-chat"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-xl text-white`}></i>
      </Button>
      
      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-20 right-5 w-80 h-96 shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="bg-blue-600 text-white p-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fas fa-robot"></i>
                <span className="font-semibold">Park Sarthi Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 hover:bg-white/10"
                data-testid="button-close-chat"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </CardHeader>
          
          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'items-start space-x-2'}`}
                  data-testid={`message-${message.role}-${index}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-blue-600 text-sm"></i>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-xs ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-blue-600 text-sm"></i>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
                disabled={isLoading}
                data-testid="input-chat-message"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="button-send-message"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
