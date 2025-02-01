import { connect } from 'mongoose';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import configs from '../../configs';
import { loggerToken } from '../tokens';

@singleton()
class Database {
  private dbUri: string;

  constructor(@inject(loggerToken) private readonly logger: Logger) {
    this.dbUri = configs.get('databaseUrl');
  }

  public async connect(): Promise<void> {
    try {
      await connect(this.dbUri);
      this.logger.info('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection error:', error);
    }
  }
}

export default Database;
