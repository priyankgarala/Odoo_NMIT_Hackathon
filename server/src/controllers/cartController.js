import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  emptyCart,
  getCartItemCount
} from "../services/cartServices.js";
import HttpError from "../utils/HttpError.js";

export const get_user_cart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user._id);
    res.status(200).json(cart || { items: [], total_items: 0, calculated_total_price: 0 });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to fetch cart"));
  }
};

export const add_to_cart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const cart = await addToCart(req.user._id, productId, quantity);
    res.status(200).json({
      message: "Item added to cart successfully",
      cart
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to add item to cart"));
  }
};

export const update_cart_item = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      throw new Error("Valid quantity is required");
    }

    const cart = await updateCartItem(req.user._id, productId, quantity);
    res.status(200).json({
      message: "Cart item updated successfully",
      cart
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to update cart item"));
  }
};

export const remove_from_cart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await removeFromCart(req.user._id, productId);
    res.status(200).json({
      message: "Item removed from cart successfully",
      cart
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to remove item from cart"));
  }
};

export const clear_user_cart = async (req, res, next) => {
  try {
    const cart = await emptyCart(req.user._id);
    res.status(200).json({
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to clear cart"));
  }
};

export const get_cart_count = async (req, res, next) => {
  try {
    const count = await getCartItemCount(req.user._id);
    res.status(200).json({ count });
  } catch (error) {
    next(HttpError.badRequest(error.message || "Failed to get cart count"));
  }
};

export default {
  get_user_cart,
  add_to_cart,
  update_cart_item,
  remove_from_cart,
  clear_user_cart,
  get_cart_count
};
