import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Payments' | 'Technical';
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I book a service at my parking location?',
    answer: 'You can book services through our Services page. Select the service type, choose your parking location, and schedule a convenient time. Our service team will come directly to your vehicle.',
    category: 'Services'
  },
  {
    id: '2',
    question: 'What documents can I store in the app?',
    answer: 'You can securely store your Driving License, RC Certificate, PUC Certificate, and Insurance documents. All documents are encrypted and only accessible by you.',
    category: 'General'
  },
  {
    id: '3',
    question: 'How do I find nearby EV charging stations?',
    answer: 'Use our EV Station Finder to locate the nearest charging stations. You can see real-time availability, pricing, and get directions with voice navigation.',
    category: 'Technical'
  },
  {
    id: '4',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit/debit cards, UPI payments, net banking, and wallet payments. All transactions are secure and encrypted.',
    category: 'Payments'
  },
  {
    id: '5',
    question: 'How do I earn and redeem points?',
    answer: 'Earn points by booking services, referring friends, and completing profile tasks. Redeem points for discounts on future services or premium features.',
    category: 'General'
  },
  {
    id: '6',
    question: 'Is my data secure in the app?',
    answer: 'Yes, all your data is encrypted and stored securely. We follow industry-standard security practices and never share your personal information with third parties.',
    category: 'Technical'
  }
];

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = ['All', 'General', 'Services', 'Payments', 'Technical'];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support & Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help with Park Sarthi services. Browse FAQs or contact our support team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Options */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Call Support</p>
                      <p className="text-sm text-gray-600">+91 1800-XXX-XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">help@parksarthi.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Currently Online</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">Average response time: 2 minutes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        data-testid={`filter-${category.toLowerCase()}`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className="border rounded-lg"
                        data-testid={`faq-${faq.id}`}
                      >
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                          onClick={() => toggleFAQ(faq.id)}
                        >
                          <span className="font-medium">{faq.question}</span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="p-4 pt-0 text-gray-600 border-t">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                      <p className="text-gray-600">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="support-name">Your Name</Label>
                          <Input
                            id="support-name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            data-testid="input-support-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="support-email">Email Address</Label>
                          <Input
                            id="support-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            data-testid="input-support-email"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="support-subject">Subject</Label>
                        <Input
                          id="support-subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          required
                          data-testid="input-support-subject"
                        />
                      </div>

                      <div>
                        <Label htmlFor="support-message">Message</Label>
                        <Textarea
                          id="support-message"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                          data-testid="textarea-support-message"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        data-testid="button-submit-support"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}