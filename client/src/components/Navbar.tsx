import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { WalletWidget } from '@/components/WalletWidget';
import AuthModal from '@/components/AuthModal';
import { Coins } from 'lucide-react';

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
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/logo.png" 
                  alt="Park Sarthi Logo" 
                  className="w-16 h-16 object-contain"
                />
                <span className="text-xl font-bold text-primary">Park Sarthi</span>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-dashboard">
                  Dashboard
                </span>
              </Link>
              <Link href="/services">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-services">
                  Services
                </span>
              </Link>
              <Link href="/documents">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-documents">
                  Documents
                </span>
              </Link>
              <Link href="/ev-stations">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-ev-stations">
                  EV Stations
                </span>
              </Link>
              <Link href="/profile">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-profile">
                  Profile
                </span>
              </Link>
              <Link href="/support">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid="nav-support">
                  Support
                </span>
              </Link>
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
