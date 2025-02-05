const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

const getPagination = (query) => {
  const page = Number(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Number(query.limit) || DEFAULT_PAGE_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
};

module.exports = { getPagination };
