import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const dialect = (process.env.DB_DIALECT || 'mysql') as 'mysql' | 'postgres';

const createSequelizeInstance = () => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect,
      logging: false,
    });
  }

  return new Sequelize(
    process.env.MYSQL_DATABASE || 'food_delivery',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || 'root',
    {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || 3306),
      dialect,
      logging: false,
    }
  );
};

export const sequelize = createSequelizeInstance();

export const connectDatabase = async () => {
  try {
    if (process.env.DATABASE_URL) {
      console.log(`Attempting to connect using ${dialect.toUpperCase()} DATABASE_URL...`);
    } else {
      const host = process.env.MYSQL_HOST || 'localhost';
      const port = process.env.MYSQL_PORT || '3306';
      const database = process.env.MYSQL_DATABASE || 'food_delivery';
      const user = process.env.MYSQL_USER || 'root';

      console.log(`Attempting to connect to ${dialect.toUpperCase()} at ${host}:${port}...`);
      console.log(`Database: ${database}`);
      console.log(`User: ${user}`);
    }

    await sequelize.authenticate();
    console.log(`${dialect.toUpperCase()} connected successfully`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
