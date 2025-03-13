import dotenv from 'dotenv';
import { Language } from './types/translate';

// Load environment variables
dotenv.config();

interface Env {
  NODE_ENV?: string;
  DISCORD_WEBHOOK_URL?: string;
  DISCORD_MENTION_ENABLED: boolean;
  TARGET_PREFECTURES?: string;
  ENABLE_LOGGER: boolean;
  LANGUAGE: Language;
}

const env: Env = {
  NODE_ENV: process.env.NODE_ENV,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  DISCORD_MENTION_ENABLED: process.env.DISCORD_MENTION_ENABLED === 'true',
  TARGET_PREFECTURES: process.env.TARGET_PREFECTURES,
  ENABLE_LOGGER: process.env.ENABLE_LOGGER
    ? process.env.ENABLE_LOGGER === 'true'
    : true,
  LANGUAGE: (process.env.LANGUAGE as Language) || ('en' as Language),
};

export default env;
