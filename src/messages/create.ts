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
    ? 'This information is a test distribution\n'
    : '';

  const body = {
    title: 'Earthquake Information',
    description: `${descriptionPrefix}Maximum intensity ${scale} was received at ${formattedTime} on ${formattedDate}.`,
    fields: points.map(([scale, regions]) => ({
      name: `Seismic Intensity ${scale}`,
      value: Array.from(regions).join(', '),
      inline: true,
    })),
    color: 2264063,
  };

  return body;
}
