const thisYear = new Date().getFullYear();

export default function getExpires(year: number) {
  return year === thisYear ? 60 * 15 : 60 * 60 * 24 * 7 * 4;
}
