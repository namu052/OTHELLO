export function create2DArray(size, fillValue = null) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => fillValue));
}
