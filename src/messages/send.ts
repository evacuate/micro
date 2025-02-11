import https from 'node:https';
import env from '~/env';
import type { Body } from '~/messages/create';

export default async function sendMessage(body: Body): Promise<void> {
  // Check if the webhook URL is set
  if (env.DISCORD_WEBHOOK_URL === undefined) return;

  const targetPrefectures = env.TARGET_PREFECTURES?.split(',') ?? [];
  if (targetPrefectures.length > 0) {
    // Extract prefectures from fields in body
    const affectedPrefectures = body.fields.flatMap((field) =>
      field.value.split(', '),
    );

    // Check if the target prefecture is included
    const shouldSend = targetPrefectures.some((target) =>
      affectedPrefectures.includes(target),
    );

    if (!shouldSend) {
      if (env.ENABLE_LOGGER) {
        console.info('No target prefectures affected, skipping webhook');
      }
      return;
    }
  }

  const webhookUrls = env.DISCORD_WEBHOOK_URL.split(',');
  let successCount = 0;

  const results = await Promise.all(
    webhookUrls.map(async (url) => {
      const success = await sendWebhook(body, url);
      if (!success) {
        console.error(`Failed to send webhook: ${url}`);
      }
      return success;
    }),
  );

  successCount = results.filter(Boolean).length;

  if (env.ENABLE_LOGGER) {
    // Log the number of successful webhooks
    console.info(`Webhook sent (${successCount}/${webhookUrls.length})`);
  }
}

async function sendWebhook(body: Body, url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const newUrl = new URL(url);

      // Setting options for POST data
      const options = {
        hostname: newUrl.hostname,
        path: newUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      };

      // Create a request
      const req = https.request(options, (res) => {
        if (res.statusCode !== undefined && res.statusCode >= 400) {
          console.error(`Webhook error: ${res.statusCode}`);
          resolve(false);
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(true);
        });
      });

      req.on('error', (e) => {
        console.error(`Error during webhook message send: ${e.message}`);
        req.destroy();
        resolve(false);
      });

      // Data to be sent to Webhook
      const payload = JSON.stringify({
        ...(env.DISCORD_MENTION_ENABLED && { content: '@everyone' }),
        embeds: [body],
      });

      // Write data to request
      try {
        req.write(payload);
        req.end();
      } catch (writeError) {
        console.error('Error writing to request:', writeError);
        req.destroy();
        resolve(false);
      }
    } catch (webhookError) {
      console.error('Error during webhook message send:', webhookError);
      resolve(false);
    }
  });
}
