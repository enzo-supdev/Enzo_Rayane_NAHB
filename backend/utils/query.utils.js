/**
 * Paginate query results
 * @param {Model} model - Mongoose model
 * @param {object} query - Query object
 * @param {object} options - Pagination options
 * @returns {Promise<object>} - Paginated results
 */
export const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  const populate = options.populate || [];

  const [results, total] = await Promise.all([
    model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate),
    model.countDocuments(query)
  ]);

  return {
    results,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      limit,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Build search query from search term
 * @param {string} searchTerm - Search term
 * @param {array} fields - Fields to search in
 * @returns {object} - MongoDB query object
 */
export const buildSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm) return {};

  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};
