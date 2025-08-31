import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/parkingsystem', {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}