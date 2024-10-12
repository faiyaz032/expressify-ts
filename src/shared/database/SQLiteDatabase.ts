import sqlite3, { Database as SQLite3Database } from 'sqlite3';
import logger from '../logger/LoggerManager';

class SQLiteDatabase {
  private static instance: SQLiteDatabase;
  public db: SQLite3Database;

  // Private constructor to prevent direct instantiation
  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
      } else {
        logger.info(`Database connected successfully at ${dbFilePath}`);
      }
    });
  }

  // Static method to get the singleton instance
  public static getInstance(): SQLiteDatabase {
    return SQLiteDatabase.instance;
  }

  // Public method to access the database connection
  public getDatabase(): SQLite3Database {
    return this.db;
  }

  // Optional: Close the database connection
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default SQLiteDatabase;
