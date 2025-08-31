const API_BASE = '/api/wallet';

export interface Wallet {
  id: number;
  userId: string;
  balance: number;
  totalEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  action: string;
  description: string;
  createdAt: string;
}

export const walletService = {
  // Get user wallet
  async getWallet(userId: string): Promise<Wallet> {
    const response = await fetch(`${API_BASE}/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallet');
    }
    return response.json();
  },

  // Earn coins
  async earnCoins(userId: string, amount: number, action: string, description: string) {
    const response = await fetch(`${API_BASE}/${userId}/earn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, action, description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to earn coins');
    }
    return response.json();
  },

  // Spend coins
  async spendCoins(userId: string, amount: number, action: string, description: string) {
    const response = await fetch(`${API_BASE}/${userId}/spend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, action, description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to spend coins');
    }
    return response.json();
  },

  // Get transaction history
  async getTransactions(userId: string): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE}/${userId}/transactions`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },
};

// Gamification actions with coin rewards
export const COIN_REWARDS = {
  PROFILE_COMPLETE: { amount: 50, description: 'Completing your profile' },
  FIRST_BOOKING: { amount: 100, description: 'Making your first parking booking' },
  BOOKING_COMPLETE: { amount: 25, description: 'Completing a parking booking' },
  NAVIGATION_USE: { amount: 10, description: 'Using navigation to find parking' },
  REVIEW_SUBMIT: { amount: 20, description: 'Submitting a parking review' },
  DAILY_LOGIN: { amount: 5, description: 'Daily login bonus' },
  SHARE_LOCATION: { amount: 15, description: 'Sharing parking location' },
  DOCUMENT_UPLOAD: { amount: 30, description: 'Uploading vehicle documents' },
  FEEDBACK_SUBMIT: { amount: 15, description: 'Submitting feedback' },
  REFERRAL: { amount: 200, description: 'Referring a friend' },
};