import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Gift, Star, Trophy, Target, Plus, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface WalletData {
  balance: number;
  totalEarned: number;
  level: number;
  levelName: string;
  xp: number;
  xpToNextLevel: number;
  redeemablePoints: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  amount: number;
  description: string;
  date: Date;
  source: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'discount' | 'free_service' | 'cashback' | 'exclusive';
  value: string;
  available: boolean;
  icon: string;
}

export default function WalletCoins() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 2450,
    totalEarned: 5200,
    level: 3,
    levelName: 'Gold Parker',
    xp: 2450,
    xpToNextLevel: 4000,
    redeemablePoints: 2450
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      amount: 50,
      description: 'Parking slot booking at C21 Mall',
      date: new Date('2024-01-20'),
      source: 'Booking Reward'
    },
    {
      id: '2',
      type: 'earned',
      amount: 100,
      description: 'First time EV charging station use',
      date: new Date('2024-01-19'),
      source: 'EV Bonus'
    },
    {
      id: '3',
      type: 'redeemed',
      amount: -200,
      description: '10% discount on FASTag recharge',
      date: new Date('2024-01-18'),
      source: 'Reward Redemption'
    },
    {
      id: '4',
      type: 'earned',
      amount: 25,
      description: 'Daily check-in bonus',
      date: new Date('2024-01-17'),
      source: 'Daily Bonus'
    },
    {
      id: '5',
      type: 'bonus',
      amount: 500,
      description: 'Level up to Gold Parker',
      date: new Date('2024-01-15'),
      source: 'Level Bonus'
    }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: '10% Off FASTag Recharge',
      description: 'Get 10% discount on your next FASTag recharge',
      pointsRequired: 200,
      category: 'discount',
      value: '₹50 savings',
      available: true,
      icon: '💳'
    },
    {
      id: '2',
      title: 'Free Car Wash',
      description: 'Complimentary car wash service at any partner location',
      pointsRequired: 300,
      category: 'free_service',
      value: '₹150 value',
      available: true,
      icon: '🚗'
    },
    {
      id: '3',
      title: '₹100 Cashback',
      description: 'Direct cashback to your bank account',
      pointsRequired: 500,
      category: 'cashback',
      value: '₹100',
      available: true,
      icon: '💰'
    },
    {
      id: '4',
      title: 'Premium Parking Spot',
      description: 'Reserved premium parking spot for 1 month',
      pointsRequired: 800,
      category: 'exclusive',
      value: 'VIP Access',
      available: true,
      icon: '🏆'
    },
    {
      id: '5',
      title: 'Valet Service Discount',
      description: '25% discount on premium valet services',
      pointsRequired: 400,
      category: 'discount',
      value: '₹125 savings',
      available: true,
      icon: '🅿️'
    },
    {
      id: '6',
      title: 'Free EV Charging',
      description: '1 hour of free EV charging at any station',
      pointsRequired: 600,
      category: 'free_service',
      value: '₹200 value',
      available: false,
      icon: '⚡'
    }
  ]);

  const levelProgress = (walletData.xp / walletData.xpToNextLevel) * 100;

  const earnPoints = (amount: number, description: string, source: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'earned',
      amount,
      description,
      date: new Date(),
      source
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setWalletData(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      xp: prev.xp + amount,
      redeemablePoints: prev.redeemablePoints + amount
    }));

    alert(`Congratulations! You earned ${amount} coins for ${description}`);
  };

  const redeemReward = (reward: Reward) => {
    if (walletData.redeemablePoints < reward.pointsRequired) {
      alert('Insufficient coins! Earn more coins to redeem this reward.');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'redeemed',
      amount: -reward.pointsRequired,
      description: reward.title,
      date: new Date(),
      source: 'Reward Redemption'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setWalletData(prev => ({
      ...prev,
      balance: prev.balance - reward.pointsRequired,
      redeemablePoints: prev.redeemablePoints - reward.pointsRequired
    }));

    alert(`Successfully redeemed: ${reward.title}! Check your email for redemption details.`);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'redeemed':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'bonus':
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discount':
        return 'bg-blue-100 text-blue-800';
      case 'free_service':
        return 'bg-green-100 text-green-800';
      case 'cashback':
        return 'bg-purple-100 text-purple-800';
      case 'exclusive':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Wallet Balance</h3>
              <p className="text-white/80">Level {walletData.level}: {walletData.levelName}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold">{walletData.balance.toLocaleString()}</p>
              <p className="text-white/80">Available Coins</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{walletData.totalEarned.toLocaleString()}</p>
              <p className="text-white/80">Total Earned</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to next level</span>
              <span>{walletData.xp}/{walletData.xpToNextLevel} XP</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-white/20" />
            <p className="text-xs text-white/70 mt-1">
              {walletData.xpToNextLevel - walletData.xp} XP needed for Platinum Parker
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => earnPoints(25, 'Daily check-in bonus', 'Daily Bonus')}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs">Daily Check-in</span>
          <span className="text-xs text-green-600">+25 coins</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => earnPoints(50, 'Parking slot booking reward', 'Booking Reward')}
        >
          <Target className="w-5 h-5" />
          <span className="text-xs">Book Parking</span>
          <span className="text-xs text-green-600">+50 coins</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => earnPoints(75, 'EV charging station use', 'EV Bonus')}
        >
          <Star className="w-5 h-5" />
          <span className="text-xs">Use EV Station</span>
          <span className="text-xs text-green-600">+75 coins</span>
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Gift className="w-5 h-5" />
              <span className="text-xs">View Rewards</span>
              <span className="text-xs text-blue-600">{rewards.filter(r => r.available).length} available</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Redeem Rewards</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="available">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Rewards</TabsTrigger>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="space-y-4">
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {rewards.filter(reward => reward.available).map((reward) => (
                    <Card key={reward.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{reward.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{reward.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge className={getCategoryColor(reward.category)}>
                                  {reward.category.replace('_', ' ')}
                                </Badge>
                                <span className="text-sm font-medium text-green-600">{reward.value}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">{reward.pointsRequired}</p>
                            <p className="text-xs text-gray-500 mb-2">coins</p>
                            <Button 
                              size="sm"
                              onClick={() => redeemReward(reward)}
                              disabled={walletData.redeemablePoints < reward.pointsRequired}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              {walletData.redeemablePoints < reward.pointsRequired ? 'Insufficient' : 'Redeem'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.date.toLocaleDateString()} • {transaction.source}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500">coins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Level Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Level Benefits & Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-600">Silver Parker (Level 2)</h4>
              <p className="text-sm text-gray-500 mb-2">5% discount on all services</p>
              <Badge variant="secondary">Unlocked</Badge>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <h4 className="font-semibold text-yellow-800">Gold Parker (Level 3)</h4>
              <p className="text-sm text-yellow-700 mb-2">10% discount + priority booking</p>
              <Badge className="bg-yellow-500 text-white">Current Level</Badge>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-600">Platinum Parker (Level 4)</h4>
              <p className="text-sm text-purple-500 mb-2">15% discount + valet access</p>
              <Badge variant="outline">Next Level</Badge>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Earn Coins:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Book parking slots: +50 coins per booking</li>
              <li>• Use EV charging stations: +75 coins per session</li>
              <li>• Complete daily check-ins: +25 coins daily</li>
              <li>• Refer friends: +200 coins per successful referral</li>
              <li>• Upload documents: +100 coins one-time bonus</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}