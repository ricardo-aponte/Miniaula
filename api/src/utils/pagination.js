// Helpers de paginación reutilizados por los listados (RT-B09).

export function getOffset(page, limit) {
  return (page - 1) * limit;
}

export function buildPagination({ page, limit, total }) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
