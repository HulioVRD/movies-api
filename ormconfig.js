const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const localDbHost = process.env.LOCAL_DB_HOST || "localhost";
const databaseUrl = `postgres://postgres:root@${localDbHost}:5434/movies-api${isTest ? "-test" : ""}`;

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL || databaseUrl,
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}