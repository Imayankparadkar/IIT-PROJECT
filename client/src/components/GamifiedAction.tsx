import React, { useState } from 'react';
import { Coins, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { walletService, COIN_REWARDS } from '@/lib/wallet';
import { useAuth } from '@/hooks/useAuth';

interface GamifiedActionProps {
  action: keyof typeof COIN_REWARDS;
  onAction: () => void | Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function GamifiedAction({ 
  action, 
  onAction, 
  children, 
  disabled = false,
  variant = 'default',
  size = 'default',
  className = ''
}: GamifiedActionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [earned, setEarned] = useState(false);

  const reward = COIN_REWARDS[action];

  const handleClick = async () => {
    if (!user || loading || earned) return;

    setLoading(true);
    try {
      // Execute the action first
      await onAction();
      
      // Then reward the user
      const result = await walletService.earnCoins(
        user.uid,
        reward.amount,
        action,
        reward.description
      );

      setEarned(true);
      
      // Show celebration toast
      toast({
        title: "🎉 Coins Earned!",
        description: `+${reward.amount} coins for ${reward.description}!`,
        duration: 4000,
      });

      // Reset earned state after animation
      setTimeout(() => setEarned(false), 3000);
    } catch (error) {
      console.error('Gamified action error:', error);
      // Still try to reward for engagement
      try {
        await walletService.earnCoins(user.uid, reward.amount, action, reward.description);
      } catch (rewardError) {
        console.error('Failed to reward user:', rewardError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={disabled || loading}
        variant={variant}
        size={size}
        className={`${className} ${earned ? 'animate-pulse bg-green-100 border-green-300' : ''} transition-all duration-300`}
      >
        {children}
        {user && (
          <Badge 
            variant="secondary" 
            className={`ml-2 ${earned ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
          >
            <Coins className="h-3 w-3 mr-1" />
            +{reward.amount}
          </Badge>
        )}
      </Button>
      
      {earned && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            <Sparkles className="h-3 w-3" />
            <span>+{reward.amount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick gamified button for common actions
export function GamifiedBookingButton({ onBook, disabled }: { onBook: () => Promise<void>; disabled?: boolean }) {
  return (
    <GamifiedAction action="BOOKING_COMPLETE" onAction={onBook} disabled={disabled}>
      <TrendingUp className="h-4 w-4 mr-2" />
      Complete Booking
    </GamifiedAction>
  );
}

export function GamifiedNavigationButton({ onNavigate }: { onNavigate: () => void }) {
  return (
    <GamifiedAction action="NAVIGATION_USE" onAction={onNavigate} variant="outline">
      Get Directions
    </GamifiedAction>
  );
}