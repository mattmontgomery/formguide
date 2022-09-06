const thisYear = new Date().getFullYear();

export default function getExpires(year: number): number {
  return year === thisYear ? 60 * 15 : 60 * 60 * 24 * 7 * 4;
}

export function getExpiresWeek(year: number): number {
  return year === thisYear ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 365.25; // one year if not the current year, one week otherwise
}
