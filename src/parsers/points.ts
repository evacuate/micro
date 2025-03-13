import parseScale from '~/parsers/scale';
import translate from '~/translate';
import { Prefecture } from '~/types/translate';
import env from '~/env';

interface Point {
  pref: string;
  scale: number;
}

const prefectureMap: Record<string, Prefecture> = {
  北海道: Prefecture.HOKKAIDO,
  青森県: Prefecture.AOMORI,
  岩手県: Prefecture.IWATE,
  宮城県: Prefecture.MIYAGI,
  秋田県: Prefecture.AKITA,
  山形県: Prefecture.YAMAGATA,
  福島県: Prefecture.FUKUSHIMA,
  茨城県: Prefecture.IBARAKI,
  栃木県: Prefecture.TOCHIGI,
  群馬県: Prefecture.GUNMA,
  埼玉県: Prefecture.SAITAMA,
  千葉県: Prefecture.CHIBA,
  東京都: Prefecture.TOKYO,
  神奈川県: Prefecture.KANAGAWA,
  新潟県: Prefecture.NIIGATA,
  富山県: Prefecture.TOYAMA,
  石川県: Prefecture.ISHIKAWA,
  福井県: Prefecture.FUKUI,
  山梨県: Prefecture.YAMANASHI,
  長野県: Prefecture.NAGANO,
  岐阜県: Prefecture.GIFU,
  静岡県: Prefecture.SHIZUOKA,
  愛知県: Prefecture.AICHI,
  三重県: Prefecture.MIE,
  滋賀県: Prefecture.SHIGA,
  京都府: Prefecture.KYOTO,
  大阪府: Prefecture.OSAKA,
  兵庫県: Prefecture.HYOGO,
  奈良県: Prefecture.NARA,
  和歌山県: Prefecture.WAKAYAMA,
  鳥取県: Prefecture.TOTTORI,
  島根県: Prefecture.SHIMANE,
  岡山県: Prefecture.OKAYAMA,
  広島県: Prefecture.HIROSHIMA,
  山口県: Prefecture.YAMAGUCHI,
  徳島県: Prefecture.TOKUSHIMA,
  香川県: Prefecture.KAGAWA,
  愛媛県: Prefecture.EHIME,
  高知県: Prefecture.KOCHI,
  福岡県: Prefecture.FUKUOKA,
  佐賀県: Prefecture.SAGA,
  長崎県: Prefecture.NAGASAKI,
  熊本県: Prefecture.KUMAMOTO,
  大分県: Prefecture.OITA,
  宮崎県: Prefecture.MIYAZAKI,
  鹿児島県: Prefecture.KAGOSHIMA,
  沖縄県: Prefecture.OKINAWA,
};

export default function parsePoints(points: Point[]): [string, Set<string>][] {
  const highestScaleMap = new Map<string, string>();
  const finalPoints = new Set<Point>();

  // Process points to find the highest scale for each pref and populate finalPoints
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      const currentHighest = highestScaleMap.get(pref);

      if (currentHighest === undefined || scale > currentHighest) {
        highestScaleMap.set(pref, scale);
        finalPoints.add(point);
      } else if (scale === currentHighest) {
        finalPoints.add(point);
      }
    }
  }

  // Create a map to group regions by scale
  const scaleMap = new Map<string, Set<string>>();
  for (const point of finalPoints) {
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (!scaleMap.has(scale)) {
        scaleMap.set(scale, new Set());
      }
      const prefEnum = prefectureMap[point.pref];
      if (prefEnum) {
        scaleMap
          .get(scale)
          ?.add(translate('prefecture', prefEnum, env.LANGUAGE));
      }
    }
  }

  // Generate the output
  const pointsInfo = Array.from(scaleMap.entries()).sort((a, b) => {
    // Compare scales by their numerical value
    const scaleA = Array.from(scaleMap.keys()).indexOf(a[0]);
    const scaleB = Array.from(scaleMap.keys()).indexOf(b[0]);
    return scaleB - scaleA;
  });

  return pointsInfo;
}
