import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';

export interface WalletData {
  balance: number;
  points: number;
  level: number;
  nextLevelPoints: number;
  totalBookings: number;
  achievements: Achievement[];
  transactions: WalletTransaction[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  pointsReward: number;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: Date;
  balanceBefore: number;
  balanceAfter: number;
}

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 500.00,
    points: 2450,
    level: 5,
    nextLevelPoints: 3000,
    totalBookings: 23,
    achievements: [],
    transactions: []
  });
  const [loading, setLoading] = useState(false);

  // Initialize wallet data
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // For now, use comprehensive dummy data that simulates a real wallet system
      const mockData: WalletData = {
        balance: 500.00,
        points: 2450,
        level: 5,
        nextLevelPoints: 3000,
        totalBookings: 23,
        achievements: [
          {
            id: 'early-bird',
            name: 'Early Bird',
            description: 'Booked 5 slots in advance',
            icon: 'fas fa-calendar',
            earned: true,
            pointsReward: 100,
            earnedAt: new Date(Date.now() - 86400000) // 1 day ago
          },
          {
            id: 'speed-parker',
            name: 'Speed Parker',
            description: '10 quick bookings',
            icon: 'fas fa-bolt',
            earned: true,
            pointsReward: 150,
            earnedAt: new Date(Date.now() - 172800000) // 2 days ago
          },
          {
            id: 'eco-warrior',
            name: 'Eco Warrior',
            description: 'Used 5 EV stations',
            icon: 'fas fa-leaf',
            earned: true,
            pointsReward: 200,
            earnedAt: new Date(Date.now() - 259200000) // 3 days ago
          },
          {
            id: 'frequent-parker',
            name: 'Frequent Parker',
            description: 'Complete 50 bookings',
            icon: 'fas fa-parking',
            earned: false,
            pointsReward: 500
          },
          {
            id: 'social-sharer',
            name: 'Social Sharer',
            description: 'Share Park Sarthi with 5 friends',
            icon: 'fas fa-share',
            earned: false,
            pointsReward: 300
          },
          {
            id: 'night-owl',
            name: 'Night Owl',
            description: '10 bookings after 10 PM',
            icon: 'fas fa-moon',
            earned: true,
            pointsReward: 120,
            earnedAt: new Date(Date.now() - 432000000) // 5 days ago
          },
          {
            id: 'weekend-warrior',
            name: 'Weekend Warrior',
            description: '15 weekend bookings',
            icon: 'fas fa-calendar-weekend',
            earned: false,
            pointsReward: 250
          }
        ],
        transactions: [
          {
            id: 'txn-1',
            type: 'credit',
            amount: 50,
            description: 'Parking booking points',
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            balanceBefore: 450,
            balanceAfter: 500
          },
          {
            id: 'txn-2',
            type: 'debit',
            amount: 25,
            description: 'Parking fee - C21 Mall',
            createdAt: new Date(Date.now() - 7200000), // 2 hours ago
            balanceBefore: 475,
            balanceAfter: 450
          },
          {
            id: 'txn-3',
            type: 'credit',
            amount: 100,
            description: 'Welcome bonus',
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            balanceBefore: 375,
            balanceAfter: 475
          },
          {
            id: 'txn-4',
            type: 'debit',
            amount: 30,
            description: 'Parking fee - Treasure Island',
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            balanceBefore: 405,
            balanceAfter: 375
          },
          {
            id: 'txn-5',
            type: 'credit',
            amount: 75,
            description: 'Referral bonus',
            createdAt: new Date(Date.now() - 259200000), // 3 days ago
            balanceBefore: 330,
            balanceAfter: 405
          }
        ]
      };

      setWalletData(mockData);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMoney = async (amount: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simulate adding money to wallet
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance + amount,
        transactions: [
          {
            id: `txn-${Date.now()}`,
            type: 'credit',
            amount: amount,
            description: 'Wallet recharge',
            createdAt: new Date(),
            balanceBefore: prev.balance,
            balanceAfter: prev.balance + amount
          },
          ...prev.transactions.slice(0, 9) // Keep only recent 10 transactions
        ]
      }));

      toast({
        title: "Money Added",
        description: `₹${amount} added to your wallet successfully!`,
      });
    } catch (error) {
      console.error('Error adding money:', error);
      toast({
        title: "Error",
        description: "Failed to add money to wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPoints = (points: number, reason: string) => {
    setWalletData(prev => {
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached ${getLevelName(newLevel)}!`,
        });
      }

      toast({
        title: "Points Earned!",
        description: `+${points} points for ${reason}`,
      });

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        nextLevelPoints: newLevel * 1000,
        totalBookings: reason.includes('booking') ? prev.totalBookings + 1 : prev.totalBookings
      };
    });
  };

  const redeemReward = (pointsCost: number, rewardName: string) => {
    if (walletData.points < pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsCost} points to redeem ${rewardName}`,
        variant: "destructive",
      });
      return;
    }

    setWalletData(prev => ({
      ...prev,
      points: prev.points - pointsCost
    }));

    toast({
      title: "Reward Redeemed!",
      description: `${rewardName} has been redeemed successfully!`,
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setWalletData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, earned: true, earnedAt: new Date() }
          : achievement
      )
    }));

    const achievement = walletData.achievements.find(a => a.id === achievementId);
    if (achievement) {
      addPoints(achievement.pointsReward, `unlocking ${achievement.name}`);
      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievement.name} - ${achievement.description}`,
      });
    }
  };

  const getLevelProgress = () => {
    const currentLevelMin = (walletData.level - 1) * 1000;
    const pointsInCurrentLevel = walletData.points - currentLevelMin;
    return (pointsInCurrentLevel / 1000) * 100;
  };

  const getLevelName = (level: number) => {
    const levelNames = {
      1: 'Rookie Parker',
      2: 'Novice Parker',
      3: 'Bronze Parker',
      4: 'Silver Parker',
      5: 'Gold Parker',
      6: 'Platinum Parker',
      7: 'Diamond Parker',
      8: 'Master Parker',
      9: 'Elite Parker',
      10: 'Legend Parker'
    };
    return levelNames[level as keyof typeof levelNames] || `Level ${level} Parker`;
  };

  const getTierBenefits = (level: number) => {
    const benefits = {
      1: ['Basic parking features'],
      2: ['Basic parking features', 'Booking history'],
      3: ['Bronze perks', '5% discount on bookings'],
      4: ['Silver perks', '10% discount on bookings', 'Priority booking'],
      5: ['Gold perks', '15% discount on bookings', 'Priority booking', 'Free valet service'],
      6: ['Platinum perks', '20% discount on bookings', 'Premium support', 'Free EV charging'],
      7: ['Diamond perks', '25% discount on bookings', 'Concierge service', 'VIP parking spots'],
      8: ['Master perks', '30% discount on bookings', 'Personal parking assistant'],
      9: ['Elite perks', '35% discount on bookings', 'Exclusive events access'],
      10: ['Legend perks', '50% discount on bookings', 'Lifetime benefits', 'Special recognition']
    };
    return benefits[level as keyof typeof benefits] || ['Custom tier benefits'];
  };

  return {
    walletData,
    loading,
    addMoney,
    addPoints,
    redeemReward,
    unlockAchievement,
    getLevelProgress,
    getLevelName,
    getTierBenefits,
    fetchWalletData
  };
};