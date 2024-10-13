import { connect } from 'mongoose';
import logger from '../logger/LoggerManager';

class Database {
  private static instance: Database;
  private dbUri: string;

  private constructor() {
    this.dbUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ihost';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await connect(this.dbUri);
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection error:', error);
    }
  }
}

export default Database;
