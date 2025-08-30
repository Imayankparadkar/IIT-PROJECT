import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface WalletData {
  points: number;
  level: number;
  nextLevelPoints: number;
  totalBookings: number;
  achievements: Achievement[];
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

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<WalletData>({
    points: 2450,
    level: 5,
    nextLevelPoints: 3000,
    totalBookings: 23,
    achievements: []
  });
  const [loading, setLoading] = useState(false);

  // Initialize achievements
  useEffect(() => {
    const achievements: Achievement[] = [
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
      }
    ];

    setWalletData(prev => ({ ...prev, achievements }));
  }, []);

  const addPoints = (points: number, reason: string) => {
    setWalletData(prev => {
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached Level ${newLevel}!`,
        });
      }

      toast({
        title: "Points Earned!",
        description: `+${points} points for ${reason}`,
      });

      return {
        ...prev,
        points: newPoints,
        level: Math.max(newLevel, prev.level),
        nextLevelPoints: (newLevel * 1000),
      };
    });
  };

  const redeemReward = (pointsCost: number, rewardName: string) => {
    if (walletData.points < pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsCost - walletData.points} more points to redeem this reward.`,
        variant: "destructive",
      });
      return false;
    }

    setWalletData(prev => ({
      ...prev,
      points: prev.points - pointsCost
    }));

    toast({
      title: "Reward Redeemed!",
      description: `Successfully redeemed ${rewardName}`,
    });

    return true;
  };

  const unlockAchievement = (achievementId: string) => {
    setWalletData(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.earned) {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.name} - +${achievement.pointsReward} points`,
          });

          return {
            ...achievement,
            earned: true,
            earnedAt: new Date()
          };
        }
        return achievement;
      });

      const unlockedAchievement = prev.achievements.find(a => a.id === achievementId);
      const pointsToAdd = unlockedAchievement?.pointsReward || 0;

      return {
        ...prev,
        points: prev.points + pointsToAdd,
        achievements: updatedAchievements
      };
    });
  };

  const getLevelProgress = () => {
    const currentLevelBase = (walletData.level - 1) * 1000;
    const nextLevelBase = walletData.level * 1000;
    const progress = ((walletData.points - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getLevelName = (level: number): string => {
    const levelNames = {
      1: 'Bronze Parker',
      2: 'Silver Parker', 
      3: 'Gold Parker',
      4: 'Platinum Parker',
      5: 'Diamond Parker',
      6: 'Elite Parker',
      7: 'Master Parker',
      8: 'Legend Parker'
    };
    return levelNames[level as keyof typeof levelNames] || `Level ${level} Parker`;
  };

  return {
    walletData,
    loading,
    addPoints,
    redeemReward,
    unlockAchievement,
    getLevelProgress,
    getLevelName
  };
};
