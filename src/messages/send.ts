import https from 'node:https';
import env from '~/env';
import type { Body } from '~/messages/create';

export default async function sendMessage(body: Body): Promise<void> {
  if (env.DISCORD_WEBHOOK_URL !== undefined) {
    try {
      const url = new URL(env.DISCORD_WEBHOOK_URL);

      // Setting options for POST data
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Create a request
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.info(`Webhook status code: ${res.statusCode}`);
        });
      });

      req.on('error', (e) => {
        console.error(`Error during webhook message send: ${e.message}`);
      });

      // Data to be sent to Webhook
      const payload = JSON.stringify({
        embeds: [body],
      });

      // Write data to request
      req.write(payload);
      req.end();

      console.info('Message successfully sent to webhook');
    } catch (webhookError) {
      console.error('Error during webhook message send:', webhookError);
    }
  }
}
