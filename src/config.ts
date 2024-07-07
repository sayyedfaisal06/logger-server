import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 8080,
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
};
