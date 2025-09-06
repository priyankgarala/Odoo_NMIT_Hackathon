import {
  addProduct,
  listMyProducts,
  listPublicProducts,
  getPublicProductById,
  searchProducts,
  getMyProduct,
  updateMyProduct,
  removeMyProduct,
} from "../services/productServices.js";
  import HttpError from "../utils/HttpError.js";
  
  export const create_product = async (req, res, next) => {
    try {
      const product = await addProduct(req.user._id, req.body);
      res.status(201).json(product);
    } catch (error) {
      next(HttpError.badRequest(error.message || "Failed to create product"));
    }
  };
  
  export const get_products = async (req, res, next) => {
    try {
      const products = await listMyProducts(req.user._id);
      res.status(200).json(products);
    } catch (error) {
      next(HttpError.badRequest(error.message || "Failed to fetch products"));
    }
  };
  
export const get_public_products = async (req, res, next) => {
  try {
    const products = await listPublicProducts();
    res.status(200).json(products);
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch products"));
  }
};

export const get_public_product = async (req, res, next) => {
  try {
    const product = await getPublicProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(HttpError.notFound(error.message || "Product not found"));
  }
};

export const search_products = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      condition: req.query.condition,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : true, // Default to active products
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      skip: req.query.skip ? parseInt(req.query.skip) : 0
    };

    const result = await searchProducts(filters);
    res.status(200).json(result);
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to search products"));
  }
};
  
  export const get_product = async (req, res, next) => {
    try {
      const product = await getMyProduct(req.user._id, req.params.id);
      res.status(200).json(product);
    } catch (error) {
      next(HttpError.notFound(error.message || "Product not found"));
    }
  };
  
  export const update_product = async (req, res, next) => {
    try {
      const product = await updateMyProduct(req.user._id, req.params.id, req.body);
      res.status(200).json(product);
    } catch (error) {
      next(HttpError.badRequest(error.message || "Failed to update product"));
    }
  };
  
  export const delete_product = async (req, res, next) => {
    try {
      await removeMyProduct(req.user._id, req.params.id);
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      next(HttpError.badRequest(error.message || "Failed to delete product"));
    }
  };
  
export default {
  create_product,
  get_products,
  get_public_products,
  get_public_product,
  search_products,
  get_product,
  update_product,
  delete_product,
};
  
  
  