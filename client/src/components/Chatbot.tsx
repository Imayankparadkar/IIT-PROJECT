import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chatbot, type ChatMessage } from '@/lib/gemini';
import { useTranslation } from 'react-i18next';
import { Upload, Globe, Image as ImageIcon, X, Send, Bot, MessageCircle } from 'lucide-react';

interface ChatImageMessage extends ChatMessage {
  image?: string;
  imageType?: string;
}

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatImageMessage[]>([
    {
      role: 'assistant',
      content: t('chat.greeting'),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting message when language changes
  useEffect(() => {
    const updateGreeting = () => {
      if (messages.length > 0 && messages[0].role === 'assistant') {
        setMessages(prev => [
          {
            role: 'assistant',
            content: t('chat.greeting'),
            timestamp: prev[0]?.timestamp || new Date()
          },
          ...prev.slice(1)
        ]);
      }
    };
    
    // Use a small delay to prevent infinite loops
    const timer = setTimeout(updateGreeting, 100);
    return () => clearTimeout(timer);
  }, [i18n.language]); // Remove 't' dependency to avoid infinite loop

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type)) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const userMessage = inputMessage.trim() || (selectedImage ? t('chat.askAboutImage') : '');
    const imageData = selectedImage && imagePreview ? imagePreview : undefined;
    
    setInputMessage('');
    removeSelectedImage();
    
    // Add user message
    const newUserMessage: ChatImageMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      image: imageData,
      imageType: selectedImage?.type
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Create a context-aware prompt with language and image support
      let promptMessage = userMessage;
      
      // Add language context
      const languageNames = {
        en: 'English',
        hi: 'Hindi (हिन्दी)',
        ta: 'Tamil (தமிழ்)',
        mr: 'Marathi (मराठी)',
        gu: 'Gujarati (ગુજરાતી)'
      };
      
      const currentLang = languageNames[i18n.language as keyof typeof languageNames] || 'English';
      promptMessage = `[User's preferred language: ${currentLang}] ${promptMessage}`;
      
      // Add image context if present
      if (selectedImage && imageData) {
        promptMessage = `[User uploaded an image: ${selectedImage.name}] ${promptMessage}. Please analyze this image in the context of parking, vehicles, or traffic management and provide helpful information.`;
      }

      // Get bot response from Gemini
      const botResponse = await chatbot.sendMessage(promptMessage);
      
      const botMessage: ChatImageMessage = {
        role: 'assistant',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatImageMessage = {
        role: 'assistant',
        content: t('chat.error'),
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageDropdownOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-110"
        data-testid="button-toggle-chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {/* Notification dot for new features */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">•</span>
        </div>
      </Button>
      
      {/* Chat Interface */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-80 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-lg flex flex-col overflow-hidden">
          {/* Chat Header */}
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-sm">{t('chat.title')}</span>
                  <div className="flex items-center space-x-1 text-xs text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Language Selector */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="text-white hover:text-gray-200 hover:bg-white/10 p-1"
                    data-testid="button-language-selector"
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                  {isLanguageDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border p-1 min-w-[120px] z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center space-x-2 ${
                            i18n.language === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                          }`}
                          data-testid={`button-language-${lang.code}`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 hover:bg-white/10 p-1"
                  data-testid="button-close-chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'items-start space-x-3'}`}
                  data-testid={`message-${message.role}-${index}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 max-w-[85%]">
                    <div
                      className={`rounded-2xl p-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <img 
                            src={message.image} 
                            alt="Uploaded" 
                            className="w-full max-w-xs rounded-lg border"
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t('chat.thinking')}</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                <button
                  onClick={removeSelectedImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">{t('chat.supportedFormats')}</p>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder={t('chat.placeholder')}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-sm border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={isLoading}
                    data-testid="input-chat-message"
                  />
                  
                  {/* Image Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    data-testid="button-upload-image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-2 rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Click outside to close language dropdown */}
      {isLanguageDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </div>
  );
}