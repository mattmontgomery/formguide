const thisYear = new Date().getFullYear();

export default function getExpires(year: number) {
  return year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;
}
