export function getArraySum(values: number[]): number {
  return values.length ? values.reduce((sum, curr) => sum + curr, 0) : 0;
}

export function getArrayAverageFormatted(values: number[], fixed = 2): string {
  const average = getArrayAverage(values);
  return (Math.round(average * 100) / 100).toFixed(fixed);
}

export function getArrayAverage(values: number[]): number {
  return values.length
    ? values.reduce((sum, curr) => sum + curr, 0) / values.length
    : 0;
}

export function getRecord(values: number[]): string {
  return `${values.filter((p) => p === 3).length}-${
    values.filter((p) => p === 1).length
  }-${values.filter((p) => p === 0).length}`;
}
export function sortByDate(field: string) {
  return (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const dateA = new Date(String(a[field]));
    const dateB = new Date(String(b[field]));
    return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
  };
}

export function chunk<T = unknown>(arr: T[], len = 10): T[][] {
  const chunks = [];
  const n = arr.length;
  let i = 0;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}
