import { test } from 'vitest';

// Import Helper Functions
import parsePoints from '../src/parsers/points';
import parseScale from '../src/parsers/scale';

// Import Message Functions
import { createEarthquakeMessage } from '../src/messages/create';

// Import Example Data
import { message } from './example';

let messageText: string;

test('message', async ({ expect }) => {
  const points = parsePoints(message[0].points);
  const earthQuake = message[0].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const scale = parseScale(maxScale ?? -1);

  if (scale !== undefined) {
    messageText = JSON.stringify(
      createEarthquakeMessage(time, scale, points, false),
    );

    // Expected Messages
    const expectedMessage =
      '{"title":"Earthquake Information","description":"Maximum intensity 3 was received at 14:18:0 on 2024/7/10.","fields":[{"name":"Seismic Intensity 1","value":"Fukuoka, Nagasaki, Miyazaki","inline":true},{"name":"Seismic Intensity 3","value":"Kumamoto","inline":true}],"color":2264063}';

    expect(messageText).toBe(expectedMessage);
  }
});

test('message 1', async ({ expect }) => {
  const points = parsePoints(message[1].points);
  const earthQuake = message[1].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const scale = parseScale(maxScale ?? -1);

  if (scale !== undefined) {
    messageText = JSON.stringify(
      createEarthquakeMessage(time, scale, points, false),
    );

    // Expected Messages
    const expectedMessage =
      '{"title":"Earthquake Information","description":"Maximum intensity 3 was received at 12:29:0 on 2024/7/10.","fields":[{"name":"Seismic Intensity 1","value":"Akita, Yamagata","inline":true},{"name":"Seismic Intensity 2","value":"Miyagi","inline":true},{"name":"Seismic Intensity 3","value":"Hokkaido, Aomori, Iwate","inline":true}],"color":2264063}';

    expect(messageText).toBe(expectedMessage);
  }
});
