import { Pool } from 'pg';
import dotenv from 'dotenv';

// โหลดการตั้งค่าจากไฟล์ .env
dotenv.config();

// import { config } from 'dotenv';

// config({ path: '.env' });

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });
    // this.pool = new Pool({
    //   user: "myuser",
    //   host: "postgres_container_100stars",
    //   database: "mydatabase",
    //   password: "mypassword",
    //   port: 5432,
    // });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }
}

export default Database;
