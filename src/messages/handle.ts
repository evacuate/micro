import parsePoints from '~/parsers/points';
import parseScale from '~/parsers/scale';
import type { JMAQuake } from '~/types';
import { createEarthquakeMessage } from '~/messages/create';
import sendMessage from '~/messages/send';

export async function handleEarthquake(
  earthquakeData: JMAQuake,
  isDev: boolean,
): Promise<void> {
  const points = parsePoints(earthquakeData.points);
  const earthQuake = earthquakeData.earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const scale = parseScale(maxScale ?? -1);

  if (scale !== undefined) {
    const body = createEarthquakeMessage(time, scale, points, isDev);
    await sendMessage(body);
    console.info('Earthquake alert received and posted successfully.');
  } else {
    console.warn('Earthquake scale is undefined.');
  }
}
