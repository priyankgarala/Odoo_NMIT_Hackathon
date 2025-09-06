import {
  findCartByUser,
  createCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartWithCalculatedTotals
} from "../microservices/cart.dao.js";

export const getCart = async (userId) => {
  return getCartWithCalculatedTotals(userId);
};

export const addToCart = async (userId, productId, quantity = 1) => {
  return addItemToCart(userId, productId, quantity);
};

export const updateCartItem = async (userId, productId, quantity) => {
  return updateCartItemQuantity(userId, productId, quantity);
};

export const removeFromCart = async (userId, productId) => {
  return removeItemFromCart(userId, productId);
};

export const emptyCart = async (userId) => {
  return clearCart(userId);
};

export const getCartItemCount = async (userId) => {
  const cart = await findCartByUser(userId);
  if (!cart) {
    return 0;
  }
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};
