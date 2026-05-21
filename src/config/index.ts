import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const PORT = process.env.PORT || 5000;

export const config = {
  port: PORT,
  jwt: process.env.JWT_SECRET as string,
  dbUrl: process.env.DB_URL as string,
};
