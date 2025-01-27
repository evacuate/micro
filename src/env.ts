import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  NODE_ENV?: string;
  DISCORD_WEBHOOK_URL?: string;
  DISCORD_MENTION_ENABLED: boolean;
  TARGET_PREFECTURES?: string;
  ENABLE_LOGGER: boolean;
}

const env: Env = {
  NODE_ENV: process.env.NODE_ENV,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  DISCORD_MENTION_ENABLED: process.env.DISCORD_MENTION_ENABLED === 'true',
  TARGET_PREFECTURES: process.env.TARGET_PREFECTURES,
  ENABLE_LOGGER: process.env.ENABLE_LOGGER
    ? process.env.ENABLE_LOGGER === 'true'
    : true,
};

export default env;
