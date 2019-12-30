const isProduction = process.env.NODE_ENV === 'production';

const localDbHost = process.env.LOCAL_DB_HOST || "localhost";
const localDbUrl = `postgres://postgres:root@${localDbHost}:5434/movies-api`;

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL || localDbUrl,
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": isProduction === false
}