export function getArraySum(values: number[]): number {
  return values.length ? values.reduce((sum, curr) => sum + curr, 0) : 0;
}

export function getArrayAverageFormatted(values: number[]): string {
  const average = getArrayAverage(values);
  return (Math.round(average * 100) / 100).toFixed(2);
}

export function getArrayAverage(values: number[]): number {
  return values.length
    ? values.reduce((sum, curr) => sum + curr, 0) / values.length
    : 0;
}
