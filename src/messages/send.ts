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
        if (res.statusCode !== undefined && res.statusCode >= 400) {
          console.error(`Webhook error: ${res.statusCode}`);
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.info(`Webhook success: ${res.statusCode}`);
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
