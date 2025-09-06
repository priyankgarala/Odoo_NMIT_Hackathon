import Product from "../models/Product.js";

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const findProductsByUser = async (userId) => {
  return Product.find({ user_id: userId }).sort({ createdAt: -1 });
};

export const findAllActiveProducts = async () => {
  return Product.find({ is_active: true }).sort({ createdAt: -1 });
};

export const findProductById = async (productId) => {
  return Product.findById(productId);
};

export const updateProductById = async (productId, updateData) => {
  return Product.findByIdAndUpdate(productId, updateData, { new: true });
};

export const deleteProductById = async (productId) => {
  return Product.findByIdAndDelete(productId);
};

export const searchAndFilterProducts = async (filters = {}) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    condition,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 50,
    skip = 0
  } = filters;

  // Build the query object
  const query = {};

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by category
  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  // Filter by price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  // Filter by condition
  if (condition) {
    query.condition = condition;
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.is_active = isActive;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const products = await Product.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('user_id', 'name email');

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
    hasNext: skip + limit < total,
    hasPrev: skip > 0
  };
};


