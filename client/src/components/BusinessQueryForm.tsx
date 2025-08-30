import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function BusinessQueryForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lookingFor: '',
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.lookingFor) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/business-inquiries', formData);
      
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your interest! We'll get back to you within 24 hours.",
      });

      setFormData({
        lookingFor: '',
        fullName: '',
        email: '',
        mobile: '',
        city: '',
        message: ''
      });
    } catch (error) {
      console.error('Business inquiry error:', error);
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Inquiries</h2>
          <p className="text-xl text-gray-600">Let's discuss how Park Sarthi can transform your parking operations</p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">I am looking for: *</Label>
                <Select 
                  value={formData.lookingFor} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lookingFor: value }))}
                >
                  <SelectTrigger data-testid="select-looking-for">
                    <SelectValue placeholder="Select your requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parking-management">Parking Management Solution</SelectItem>
                    <SelectItem value="business-partnership">Business Partnership</SelectItem>
                    <SelectItem value="technology-integration">Technology Integration</SelectItem>
                    <SelectItem value="custom-solutions">Custom Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</Label>
                  <Input 
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your name"
                    data-testid="input-full-name"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Email *</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Mobile No. *</Label>
                  <Input 
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="Enter mobile number"
                    data-testid="input-mobile"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">City</Label>
                  <Input 
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                    data-testid="input-city"
                  />
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Message</Label>
                <Textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your requirements"
                  data-testid="textarea-message"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={isSubmitting}
                data-testid="button-submit-inquiry"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
