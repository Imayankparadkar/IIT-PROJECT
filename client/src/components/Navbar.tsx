import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { walletData } = useWallet();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-parking text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-primary">Park Sarthi</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-products"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('business')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-business"
              >
                For Business
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </div>
            
            {/* Wallet & Auth */}
            <div className="flex items-center space-x-4">
              {/* Wallet Display */}
              {user && (
                <div className="hidden sm:flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full wallet-glow">
                  <i className="fas fa-coins text-yellow-600"></i>
                  <span className="text-yellow-700 font-semibold" data-testid="wallet-points">
                    {walletData.points.toLocaleString()}
                  </span>
                  <span className="text-yellow-600 text-sm">points</span>
                </div>
              )}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium" data-testid="user-greeting">
                    Hi, {user.phoneNumber?.slice(-4) || 'User'}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    data-testid="button-logout"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAuthClick('login')}
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => handleAuthClick('signup')}
                    data-testid="button-signup"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}
