import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { login, register, isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      onClose();
      resetForms();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword || registerPassword !== confirmPassword) {
      return;
    }

    try {
      await register(registerEmail, registerPassword, registerName);
      onClose();
      resetForms();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    onClose();
    resetForms();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">PS</span>
            </div>
            Welcome to Park Sarthi
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 font-normal">
            Smart parking management made simple
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-login-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-200"
                disabled={!loginEmail || !loginPassword || isAuthLoading}
                data-testid="button-login"
              >
                {isAuthLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-register-name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-register-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    data-testid="input-register-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
                {registerPassword && confirmPassword && registerPassword !== confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-200"
                disabled={!registerName || !registerEmail || !registerPassword || registerPassword !== confirmPassword || isAuthLoading}
                data-testid="button-register"
              >
                {isAuthLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}