import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Create a new order from cart items
export const createOrder = async (userId, orderData = {}) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Prepare order items with product details
    const orderItems = cart.items.map(item => ({
      product_id: item.product_id._id,
      quantity: item.quantity,
      price_at_purchase: item.product_id.price,
      product_name: item.product_id.name,
      product_image: item.product_id.image_url
    }));

    // Calculate totals
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    // Create order
    const order = new Order({
      user_id: userId,
      items: orderItems,
      total_amount: totalAmount,
      total_items: totalItems,
      status: "completed",
      shipping_address: orderData.shipping_address || {},
      payment_method: orderData.payment_method || "credit_card",
      payment_status: "completed"
    });

    await order.save();

    // Clear the cart after successful order
    await Cart.findOneAndUpdate(
      { user_id: userId },
      { items: [], total_items: 0, total_price: 0 },
      { new: true }
    );

    return await order.populate('items.product_id');
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

// Get all orders for a user (previous purchases)
export const getUserOrders = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user_id: userId })
      .populate('items.product_id')
      .sort({ order_date: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user_id: userId });

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({ _id: orderId, user_id: userId })
      .populate('items.product_id');
    
    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

// Get order statistics for a user
export const getUserOrderStats = async (userId) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total_amount" },
          totalItems: { $sum: "$total_items" },
          averageOrderValue: { $avg: "$total_amount" }
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      totalItems: 0,
      averageOrderValue: 0
    };
  } catch (error) {
    throw new Error(`Failed to fetch order statistics: ${error.message}`);
  }
};

// Get recent purchases (last 5 orders)
export const getRecentPurchases = async (userId, limit = 5) => {
  try {
    const orders = await Order.find({ user_id: userId })
      .populate('items.product_id')
      .sort({ order_date: -1 })
      .limit(limit);

    return orders;
  } catch (error) {
    throw new Error(`Failed to fetch recent purchases: ${error.message}`);
  }
};
