import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * database.ts
 * -----------
 * Manages the MongoDB connection lifecycle via Mongoose.
 * Exposes connect/disconnect functions used by server.ts during
 * startup and graceful shutdown.
 */

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    logger.error('❌ MongoDB connection failed', { error });
    throw error;
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('❌ MongoDB connection error', { error });
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
}
