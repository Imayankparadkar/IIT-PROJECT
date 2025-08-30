import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { loginWithPhone, verifyOTP, isPhoneAuthLoading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      return;
    }

    try {
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error('Phone auth error:', error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6 || !confirmationResult) {
      return;
    }

    try {
      await verifyOTP(confirmationResult, otp);
      onClose();
      resetForm();
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setConfirmationResult(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-mobile-alt text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Park Sarthi</h3>
            <p className="text-gray-600 font-normal">
              {step === 'phone' ? 'Enter your mobile number to get started' : 'Enter the OTP sent to your phone'}
            </p>
          </DialogTitle>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</Label>
              <div className="flex">
                <select className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500">
                  <option>+91</option>
                </select>
                <Input 
                  type="tel" 
                  placeholder="9999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 rounded-l-none"
                  maxLength={10}
                  data-testid="input-phone-number"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              disabled={phoneNumber.length !== 10 || isPhoneAuthLoading}
              data-testid="button-send-otp"
            >
              {isPhoneAuthLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</Label>
              <Input 
                type="text" 
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-lg tracking-widest"
                maxLength={6}
                data-testid="input-otp"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              disabled={otp.length !== 6 || isPhoneAuthLoading}
              data-testid="button-verify-otp"
            >
              {isPhoneAuthLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => setStep('phone')}
              className="w-full text-blue-600 hover:text-blue-700 transition-colors"
              data-testid="button-back-to-phone"
            >
              Back to Phone Number
            </Button>
          </form>
        )}

        {/* Recaptcha container */}
        <div id="recaptcha-container"></div>
      </DialogContent>
    </Dialog>
  );
}
