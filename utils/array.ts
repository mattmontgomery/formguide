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
