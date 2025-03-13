import translate from '~/translate';
import { MessageKey } from '~/types/translate';
import env from '~/env';

export interface Body {
  title: string;
  description: string;
  fields: { name: string; value: string; inline: boolean }[];
  color: number;
}

export function createEarthquakeMessage(
  time: string,
  scale: string,
  points: [string, Set<string>][],
  isDev: boolean,
): Body {
  const newTime = new Date(time);
  const formattedTime = `${newTime.getHours()}:${String(newTime.getMinutes()).padStart(2, '0')}:${String(newTime.getSeconds()).padStart(2, '0')}`;
  const formattedDate = `${newTime.getFullYear()}/${String(newTime.getMonth() + 1).padStart(2, '0')}/${String(newTime.getDate()).padStart(2, '0')}`;

  const descriptionPrefix = isDev
    ? `${translate('message', MessageKey.TEST_DISTRIBUTION, env.LANGUAGE)}`
    : '';

  const body = {
    title: translate('message', MessageKey.EARTHQUAKE_INFO, env.LANGUAGE),
    description: `${descriptionPrefix}
    ${translate('message', MessageKey.MAX_INTENSITY_RECEIVED, env.LANGUAGE)
      .replace('{scale}', scale)
      .replace('{time}', formattedTime)
      .replace('{date}', formattedDate)}`,
    fields: points.map(([scale, regions]) => ({
      name: `${translate('message', MessageKey.SEISMIC_INTENSITY, env.LANGUAGE)} ${scale}`,
      value: Array.from(regions).join(', '),
      inline: true,
    })),
    color: 2264063,
  };

  return body;
}
