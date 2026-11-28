// Construye los botones del paginador: 1 … 4 5 6 … 20
export function buildPageList(page, totalPages, windowSize = 1) {
  if (totalPages <= 1) {
    return [1];
  }

  const pages = new Set([1, totalPages]);

  for (let current = page - windowSize; current <= page + windowSize; current += 1) {
    if (current >= 1 && current <= totalPages) {
      pages.add(current);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);

  return sorted.reduce((result, value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push('…');
    }
    result.push(value);
    return result;
  }, []);
}
