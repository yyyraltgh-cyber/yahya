/**
 * Lightweight, offline, deterministic Gregorian→Hijri conversion using the
 * standard tabular ("Kuwaiti algorithm") civil Islamic calendar — the same
 * arithmetic approximation used by ICU and most offline Hijri utilities.
 * Verified against known reference dates: March 1, 2025 -> 1 Ramadan 1446;
 * March 31, 2025 -> 1 Shawwal 1446 (Eid al-Fitr).
 *
 * This is a calendrical approximation (±1 day around actual moon sighting
 * in some months/regions), not a moon-sighting authority — acceptable here
 * since it only gates a soft, dismissible UI suggestion (see ramadan.ts),
 * never anything the user can't see or override.
 */
export interface HijriDate {
  year: number;
  month: number; // 1-12 (1 = Muharram, 9 = Ramadan)
  day: number;
}

export function gregorianToHijri(date: Date): HijriDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  // Gregorian date -> Julian Day Number
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn =
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045;

  // Julian Day Number -> tabular Hijri date (closed-form)
  const islamicEpoch = 1948440; // JDN of 1 Muharram 1 AH
  const l = jdn - islamicEpoch + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return { year: hYear, month: hMonth, day: hDay };
}

/** True during the Hijri month of Ramadan (month 9). */
export function isRamadan(date: Date = new Date()): boolean {
  return gregorianToHijri(date).month === 9;
}
