import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  NODE_ENV?: 'development' | 'production';
  DISCORD_WEBHOOK_URL?: string;
}

const env: Env = {
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
};

export default env;
