import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, History, Settings, Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

interface FASTagData {
  balance: number;
  autoRecharge: boolean;
  autoRechargeAmount: number;
  autoRechargeThreshold: number;
  lastUpdated: any;
}

interface Transaction {
  id: string;
  type: 'recharge' | 'toll' | 'auto-recharge';
  amount: number;
  date: any;
  status: 'completed' | 'pending' | 'failed';
  location?: string;
  transactionId: string;
}

export default function FASTagServices() {
  const { user } = useAuth();
  const [fastagData, setFastagData] = useState<FASTagData>({
    balance: 0,
    autoRecharge: false,
    autoRechargeAmount: 500,
    autoRechargeThreshold: 100,
    lastUpdated: null
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isRecharging, setIsRecharging] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFASTagData();
      loadTransactions();
    }
  }, [user]);

  const loadFASTagData = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'fastag', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFastagData(docSnap.data() as FASTagData);
      } else {
        // Create initial FASTag data
        const initialData: FASTagData = {
          balance: 1250, // Default balance for demo
          autoRecharge: false,
          autoRechargeAmount: 500,
          autoRechargeThreshold: 100,
          lastUpdated: serverTimestamp()
        };
        await setDoc(docRef, initialData);
        setFastagData(initialData);
      }
    } catch (error) {
      console.error('Error loading FASTag data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'fastagTransactions'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const transactionList: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        transactionList.push({ id: doc.id, ...doc.data() } as Transaction);
      });

      setTransactions(transactionList);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleRecharge = async () => {
    if (!user || !rechargeAmount || isRecharging) return;

    const amount = parseInt(rechargeAmount);
    if (amount < 100 || amount > 10000) {
      alert('Recharge amount must be between ₹100 and ₹10,000');
      return;
    }

    setIsRecharging(true);

    try {
      // Create transaction record
      const transaction = {
        type: 'recharge' as const,
        amount: amount,
        date: serverTimestamp(),
        status: 'completed' as const,
        transactionId: `TXN${Date.now()}`,
        userId: user.uid
      };

      await addDoc(collection(db, 'fastagTransactions'), transaction);

      // Update FASTag balance
      const docRef = doc(db, 'fastag', user.uid);
      const newBalance = fastagData.balance + amount;
      
      await updateDoc(docRef, {
        balance: newBalance,
        lastUpdated: serverTimestamp()
      });

      setFastagData(prev => ({
        ...prev,
        balance: newBalance
      }));

      setRechargeAmount('');
      setShowRechargeDialog(false);
      loadTransactions(); // Reload transactions
      
      alert(`Successfully recharged ₹${amount}. New balance: ₹${newBalance}`);
    } catch (error) {
      console.error('Error processing recharge:', error);
      alert('Failed to process recharge. Please try again.');
    } finally {
      setIsRecharging(false);
    }
  };

  const toggleAutoRecharge = async (enabled: boolean) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'fastag', user.uid);
      await updateDoc(docRef, {
        autoRecharge: enabled,
        lastUpdated: serverTimestamp()
      });

      setFastagData(prev => ({
        ...prev,
        autoRecharge: enabled
      }));

      if (enabled) {
        alert(`Auto-recharge enabled. Will recharge ₹${fastagData.autoRechargeAmount} when balance falls below ₹${fastagData.autoRechargeThreshold}`);
      }
    } catch (error) {
      console.error('Error updating auto-recharge:', error);
      alert('Failed to update auto-recharge setting');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
      case 'auto-recharge':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'toll':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading FASTag services...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">FASTag Services</h3>
            <p className="text-sm text-white/80">Manage your FASTag account</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Balance Display */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Current Balance</p>
              <p className="text-2xl font-bold">₹{fastagData.balance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Last Updated</p>
              <p className="text-sm">{formatDate(fastagData.lastUpdated)}</p>
            </div>
          </div>
          
          {fastagData.balance < 200 && (
            <div className="mt-2 p-2 bg-red-500/20 rounded text-sm">
              ⚠️ Low balance! Consider recharging your FASTag.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Recharge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Recharge FASTag</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Recharge Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount (₹100 - ₹10,000)"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    min="100"
                    max="10000"
                    className="mt-1"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setRechargeAmount(amount.toString())}
                      className="text-xs"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                  <p className="font-medium">Payment Methods:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• UPI / Net Banking</li>
                    <li>• Credit / Debit Card</li>
                    <li>• Digital Wallets</li>
                    <li>• Instant processing (usually within 2 minutes)</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleRecharge}
                  disabled={isRecharging || !rechargeAmount}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isRecharging ? 'Processing...' : `Recharge ₹${rechargeAmount || '0'}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showTransactionHistory} onOpenChange={setShowTransactionHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-blue-600 border-white/30 hover:bg-white/10">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Transaction History</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions found</p>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium capitalize">{transaction.type.replace('-', ' ')}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          {transaction.location && (
                            <p className="text-xs text-gray-400">{transaction.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'toll' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'toll' ? '-' : '+'}₹{transaction.amount}
                        </p>
                        <div className="flex items-center space-x-1">
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Auto Recharge Settings */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Auto Recharge</p>
              <p className="text-sm text-white/80">Automatically recharge when balance is low</p>
            </div>
            <Switch
              checked={fastagData.autoRecharge}
              onCheckedChange={toggleAutoRecharge}
            />
          </div>
          
          {fastagData.autoRecharge && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Threshold:</span>
                <span>₹{fastagData.autoRechargeThreshold}</span>
              </div>
              <div className="flex justify-between">
                <span>Recharge Amount:</span>
                <span>₹{fastagData.autoRechargeAmount}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}