import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * DataSource used by the TypeORM CLI (migrations).
 * Runs against compiled output in `dist` (see npm "migration:*" scripts).
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
