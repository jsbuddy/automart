import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// const connectionString = 'postgres://uvfgvozzyuqjxe:0ac78705e75f3256c1cd0431e54e30ce2e7234f21e5595e12175c3b207154124@ec2-75-101-147-226.compute-1.amazonaws.com:5432/d4djeuf1hf9gpl?ssl=true';
const pool = new Pool();

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tcarstate') THEN
            CREATE TYPE TCarState AS ENUM ('new', 'used');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tcarstatus') THEN
            CREATE TYPE TCarStatus AS ENUM ('sold', 'available');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tcarbody') THEN
            CREATE TYPE TCarBody AS ENUM ('car', 'truck', 'trailer', 'van');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'torderstatus') THEN
            CREATE TYPE TOrderStatus AS ENUM ('pending', 'accepted', 'rejected');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tflagreason') THEN
            CREATE TYPE TFLagReason AS ENUM ('pricing', 'weird demands');
          END IF;
      END
      $$;
    `);
    await client.query(`
          CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "firstName" VARCHAR(50) NOT NULL,
            "lastName" VARCHAR(50) NOT NULL,
            "email" VARCHAR(50) NOT NULL UNIQUE,
            "address" TEXT NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "isAdmin" BOOLEAN DEFAULT FALSE,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
    await client.query(`
          CREATE TABLE IF NOT EXISTS cars(
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "owner" UUID NOT NULL,
            "state" TCarState NOT NULL,
            "status" TCarStatus DEFAULT 'available',
            "price" REAL NOT NULL,
            "manufacturer" VARCHAR(255) NOT NULL,
            "model" VARCHAR(255) NOT NULL,
            "bodyType" TCarBody NOT NULL,
            "images" JSON [] NOT NULL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("owner") REFERENCES users("id")
          );
        `);
    await client.query(`
          CREATE TABLE IF NOT EXISTS orders(
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "buyer" UUID NOT NULL,
            "carId" UUID NOT NULL,
            "status" TOrderStatus NOT NULL,
            "price" REAL NOT NULL,
            "priceOffered" REAL NOT NULL,
            "oldPriceOffered" REAL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("buyer") REFERENCES users("id"),
            FOREIGN KEY ("carId") REFERENCES cars("id")
          );
        `);
    await client.query(`
          CREATE TABLE IF NOT EXISTS flags(
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "creator" UUID NOT NULL,
            "carId" UUID NOT NULL,
            "reason" TFLagReason NOT NULL,
            "description" TEXT NOT NULL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("creator") REFERENCES users("id"),
            FOREIGN KEY ("carId") REFERENCES cars("id")
          );
        `);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
})().catch(e => console.error(e.stack));

export default {
  query: (text, params, callback) => pool.query(text, params, callback),
};
