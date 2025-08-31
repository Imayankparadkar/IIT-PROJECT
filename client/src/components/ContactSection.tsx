import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email via backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          toEmail: 'immayankparadkar@gmail.com'
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you for contacting us! We'll get back to you soon.",
        });
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let us solve your problems next</h2>
        <p className="text-xl text-blue-100 mb-8">Get in Touch!</p>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
              <div className="space-y-4 text-blue-100">
                <div className="flex items-center space-x-3" data-testid="contact-email">
                  <i className="fas fa-envelope text-yellow-400"></i>
                  <div>
                    <div>Support: support@myparkplus.com</div>
                    <div>Business: sales@myparkplus.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3" data-testid="contact-address">
                  <i className="fas fa-map-marker-alt text-yellow-400"></i>
                  <div>
                    Unitech Cyber Park, 5th Floor, Tower A,<br />
                    Sec-39, Gurugram, Haryana 122022
                  </div>
                </div>
                <div className="flex items-center space-x-3" data-testid="contact-phone">
                  <i className="fas fa-phone text-yellow-400"></i>
                  <div>+91 99999 00000</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Quick Contact</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  type="text" 
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/20 text-white placeholder-white/70 border-white/30"
                  data-testid="input-contact-name"
                />
                <Input 
                  type="email" 
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/20 text-white placeholder-white/70 border-white/30"
                  data-testid="input-contact-email"
                />
                <Textarea 
                  rows={3} 
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-white/20 text-white placeholder-white/70 border-white/30"
                  data-testid="textarea-contact-message"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                  disabled={isSubmitting}
                  data-testid="button-send-contact"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
