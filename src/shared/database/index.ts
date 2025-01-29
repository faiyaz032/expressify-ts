import { connect } from 'mongoose';
import configs from '../../configs';
import logger from '../logger';

class Database {
  private static instance: Database;
  private dbUri: string;

  constructor() {
    this.dbUri = configs.get('databaseUrl');
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
