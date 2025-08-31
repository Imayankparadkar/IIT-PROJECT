import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, History, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { walletService, type Wallet, type Transaction } from '@/lib/wallet';
import { useAuth } from '@/hooks/useAuth';

interface WalletWidgetProps {
  showFullView?: boolean;
  onToggleView?: () => void;
}

export function WalletWidget({ showFullView = false, onToggleView }: WalletWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [walletData, transactionData] = await Promise.all([
        walletService.getWallet(user.uid),
        showFullView ? walletService.getTransactions(user.uid) : Promise.resolve([])
      ]);
      
      setWallet(walletData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!showFullView) {
    // Compact wallet display
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onToggleView}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Coins className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {wallet?.balance || 0} Coins
                </p>
                <p className="text-xs text-gray-500">
                  Total earned: {wallet?.totalEarned || 0}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Gift className="h-4 w-4 mr-1" />
              Earn More
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full wallet view
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>My Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {wallet?.balance || 0}
              </div>
              <div className="text-sm text-yellow-600">Available Coins</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {wallet?.totalEarned || 0}
              </div>
              <div className="text-sm text-green-600">Total Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Coins className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start using features to earn coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'earn' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <Coins className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={transaction.type === 'earn' ? 'default' : 'secondary'}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} coins
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earn More Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Gift className="h-6 w-6" />
              <span className="text-sm">Complete Profile</span>
              <span className="text-xs text-gray-500">+50 coins</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Make Booking</span>
              <span className="text-xs text-gray-500">+25 coins</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}