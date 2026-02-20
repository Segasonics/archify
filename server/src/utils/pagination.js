function getPagination(query = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 10, 1), 50);
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
  };
}

module.exports = getPagination;

