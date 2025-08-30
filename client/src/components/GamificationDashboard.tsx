import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';

export default function GamificationDashboard() {
  const { user } = useAuth();
  const { walletData, getLevelProgress, getLevelName, redeemReward } = useWallet();

  if (!user) {
    return null;
  }

  const levelProgress = getLevelProgress();
  const earnedAchievements = walletData.achievements.filter(a => a.earned);

  const handleRedeemReward = (pointsCost: number, rewardName: string) => {
    redeemReward(pointsCost, rewardName);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Parking Journey</h2>
          <p className="text-xl text-blue-100">Level up with every booking and earn exciting rewards!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Current Level */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl text-purple-900"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="user-level-name">
                {getLevelName(walletData.level)}
              </h3>
              <p className="text-blue-200 mb-4">
                Level {walletData.level} - Next: {getLevelName(walletData.level + 1)}
              </p>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                  data-testid="level-progress"
                ></div>
              </div>
              <p className="text-sm" data-testid="level-progress-text">
                {walletData.points}/{walletData.nextLevelPoints} XP
              </p>
            </CardContent>
          </Card>
          
          {/* Recent Achievements */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h3 className="text-xl font-semibold mb-4 text-center">Recent Achievements</h3>
              <div className="space-y-3">
                {earnedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3" data-testid={`achievement-${achievement.id}`}>
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <i className={`${achievement.icon} text-green-900 text-xs`}></i>
                    </div>
                    <div>
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-blue-200">{achievement.description}</div>
                    </div>
                  </div>
                ))}
                
                {earnedAchievements.length === 0 && (
                  <div className="text-center text-blue-200 py-4">
                    Start booking to earn achievements!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Wallet & Rewards */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-coins text-2xl text-purple-900"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="wallet-points-display">
                {walletData.points.toLocaleString()} Points
              </h3>
              <p className="text-blue-200 mb-4">Available Balance</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => handleRedeemReward(1000, 'Free Parking Hour')}
                  className="w-full bg-yellow-400 text-purple-900 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                  disabled={walletData.points < 1000}
                  data-testid="button-redeem-reward"
                >
                  Redeem Rewards
                </Button>
                <div className="text-xs text-blue-200">
                  Next reward at {walletData.nextLevelPoints} points
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
