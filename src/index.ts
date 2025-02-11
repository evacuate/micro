import WebSocket from 'ws';
import env from '~/env';

import { handleEarthquake } from '~/messages/handle';
import type { JMAQuake, JMATsunami } from '~/types';

const NODE_ENV = env.NODE_ENV ?? 'development';
const isDev: boolean = NODE_ENV === 'development';

let reconnectAttempts = 0;
const BASE_RECONNECT_DELAY = 5000; // 5 seconds
const MAX_RECONNECT_DELAY = 30000; // Maximum 30 seconds

let isFirstRun = true; // Flag to check if it's the initial run

if (env.DISCORD_WEBHOOK_URL !== undefined) {
  const webhookUrls = env.DISCORD_WEBHOOK_URL.split(',');
  for (const url of webhookUrls) {
    if (!String(url).startsWith('https://discord.com/api/webhooks/')) {
      console.error('DISCORD_WEBHOOK_URL is not set or invalid.');
      process.exit(1);
    }
  }
} else {
  console.error('DISCORD_WEBHOOK_URL is not set.');
  process.exit(1);
}

async function initWebSocket(): Promise<void> {
  try {
    if (isFirstRun) {
      console.info(
        `Now running in ${isDev ? 'development' : 'production'} mode.`,
      );
      isFirstRun = false; // Set the flag to false after the first run
    }

    const url = isDev
      ? 'wss://api-realtime-sandbox.p2pquake.net/v2/ws'
      : 'wss://api.p2pquake.net/v2/ws';

    const socket = new WebSocket(url);

    // WebSocket event listeners
    socket.onopen = () => {
      onOpen();
    };

    socket.onmessage = (message) => {
      onMessage(message.data);
    };

    socket.onerror = (error) => {
      onError(error.message);
    };

    socket.onclose = (events) => {
      onClose(events.code, events.reason);
    };
  } catch (error) {
    console.error('Error during login or WebSocket initialization: ', error);
  }
}

// Initialize the WebSocket connection
void (async () => {
  await initWebSocket();
})();

async function onMessage(message: WebSocket.Data): Promise<void> {
  try {
    if (isDev) console.debug('Message received from server.');
    const earthQuakeData = JSON.parse(message.toString() as string) as
      | JMAQuake
      | JMATsunami;

    if (earthQuakeData.code === 551) {
      await handleEarthquake(earthQuakeData as JMAQuake, isDev);
    } else {
      if (isDev) {
        console.warn(
          'Unknown message code: ',
          (earthQuakeData as JMAQuake | JMATsunami).code,
        );
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
}

async function onError(error: string): Promise<void> {
  console.error('WebSocket connection error:', error);
}

async function onClose(code: number, reason: string): Promise<void> {
  console.info('WebSocket connection closed:', {
    code,
    reason: reason.toString(),
  });

  // Calculate the waiting time by exponential backoff
  const delay = Math.min(
    BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts),
    MAX_RECONNECT_DELAY,
  );
  console.info(`Reconnecting in ${delay} ms...`);

  setTimeout(() => {
    reconnectAttempts++; // Increment the number of reconnection attempts
    console.info('Attempting to reconnect...');
    void initWebSocket();
  }, delay);
}

async function onOpen(): Promise<void> {
  console.info('WebSocket connection opened.');

  // Reset the number of reconnection attempts on successful connection
  reconnectAttempts = 0;
}
