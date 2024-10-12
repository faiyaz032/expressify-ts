import SQLiteDatabase from './SQLiteDatabase';

const sqlite3Database = SQLiteDatabase.getInstance();

const db = sqlite3Database.getDatabase();

export default db;
