export function sortByDate<T extends { rawDate: string }>(a: T, b: T) {
  const aDate = new Date(a.rawDate);
  const bDate = new Date(b.rawDate);
  return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
}
