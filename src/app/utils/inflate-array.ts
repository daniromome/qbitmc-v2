export function inflateArray<T>(array: T[], length: number): T[] {
  if (array.length >= length) return array
  const count = Math.ceil(length / array.length)
  return Array(count).fill(array).flat()
}
