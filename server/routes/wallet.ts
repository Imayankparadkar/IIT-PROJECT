import express from 'express';
import { Wallet } from '../models/Wallet.js';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();

// Get wallet for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let wallet = await Wallet.findOne({ where: { userId } });
    
    if (!wallet) {
      // Create wallet if doesn't exist
      wallet = await Wallet.create({
        userId,
        balance: 0,
        totalEarned: 0
      });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Failed to fetch wallet' });
  }
});

// Add coins to wallet
router.post('/:userId/earn', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, action, description } = req.body;
    
    let wallet = await Wallet.findOne({ where: { userId } });
    
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: amount,
        totalEarned: amount
      });
    } else {
      wallet.balance += amount;
      wallet.totalEarned += amount;
      await wallet.save();
    }
    
    // Record transaction
    await Transaction.create({
      userId,
      amount,
      type: 'earn',
      action,
      description
    });
    
    res.json({ 
      wallet,
      message: `You earned ${amount} coins for ${description}!`
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ message: 'Failed to add coins' });
  }
});

// Spend coins from wallet
router.post('/:userId/spend', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, action, description } = req.body;
    
    const wallet = await Wallet.findOne({ where: { userId } });
    
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    wallet.balance -= amount;
    await wallet.save();
    
    // Record transaction
    await Transaction.create({
      userId,
      amount,
      type: 'spend',
      action,
      description
    });
    
    res.json({ 
      wallet,
      message: `You spent ${amount} coins on ${description}`
    });
  } catch (error) {
    console.error('Error spending coins:', error);
    res.status(500).json({ message: 'Failed to spend coins' });
  }
});

// Get transaction history
router.get('/:userId/transactions', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

export default router;