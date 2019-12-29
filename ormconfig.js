const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5434/movies-api",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": isProduction === false
}