import {
  createOrder,
  getUserOrders,
  getOrderById,
  getUserOrderStats,
  getRecentPurchases
} from "../services/orderServices.js";
import HttpError from "../utils/HttpError.js";

// Create a new order (checkout)
export const create_user_order = async (req, res, next) => {
  try {
    const orderData = req.body;
    const order = await createOrder(req.user._id, orderData);
    
    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to create order"));
  }
};

// Get user's previous purchases (orders)
export const get_user_orders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getUserOrders(req.user._id, parseInt(page), parseInt(limit));
    
    res.status(200).json({
      message: "Orders fetched successfully",
      ...result
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch orders"));
  }
};

// Get a specific order by ID
export const get_user_order = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId, req.user._id);
    
    res.status(200).json({
      message: "Order fetched successfully",
      order
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch order"));
  }
};

// Get user's order statistics
export const get_user_order_stats = async (req, res, next) => {
  try {
    const stats = await getUserOrderStats(req.user._id);
    
    res.status(200).json({
      message: "Order statistics fetched successfully",
      stats
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch order statistics"));
  }
};

// Get recent purchases
export const get_recent_purchases = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const orders = await getRecentPurchases(req.user._id, parseInt(limit));
    
    res.status(200).json({
      message: "Recent purchases fetched successfully",
      orders
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch recent purchases"));
  }
};

export default {
  create_user_order,
  get_user_orders,
  get_user_order,
  get_user_order_stats,
  get_recent_purchases
};
