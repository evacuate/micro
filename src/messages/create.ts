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
  const receivedTime = `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()} on ${newTime.getFullYear()}/${newTime.getMonth()}/${newTime.getDate()}`;

  const descriptionPrefix = isDev
    ? 'This information is a test distribution\n'
    : '';

  const body = {
    title: 'Earthquake Information',
    description: `${descriptionPrefix}Maximum intensity ${scale} was received at ${receivedTime}.`,
    fields: points.map(([scale, regions]) => ({
      name: `Seismic Intensity ${scale}`,
      value: Array.from(regions).join(', '),
      inline: true,
    })),
    color: 2264063,
  };

  return body;
}
