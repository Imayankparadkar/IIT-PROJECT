import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database.js';

interface WalletAttributes {
  id: number;
  userId: string;
  balance: number;
  totalEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WalletCreationAttributes extends Optional<WalletAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: number;
  public userId!: string;
  public balance!: number;
  public totalEarned!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalEarned: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'wallets',
    sequelize,
  }
);

export { Wallet };