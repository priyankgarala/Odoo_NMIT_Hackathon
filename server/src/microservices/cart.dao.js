import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const findCartByUser = async (userId) => {
  return Cart.findOne({ user_id: userId }).populate({
    path: 'items.product_id',
    model: 'Product',
    populate: {
      path: 'user_id',
      model: 'User',
      select: 'name email'
    }
  });
};

export const createCart = async (userId) => {
  const cart = new Cart({ user_id: userId, items: [] });
  return cart.save();
};

export const addItemToCart = async (userId, productId, quantity = 1) => {
  // Check if product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.is_active) {
    throw new Error("Product not found or not available");
  }

  // Check if product has enough quantity
  if (product.quantity < quantity) {
    throw new Error("Insufficient product quantity available");
  }

  // Find or create cart
  let cart = await findCartByUser(userId);
  if (!cart) {
    cart = await createCart(userId);
  }

  // Check if item already exists in cart
  const existingItem = cart.items.find(item => 
    item.product_id.toString() === productId.toString()
  );

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.quantity) {
      throw new Error("Insufficient product quantity available");
    }
    existingItem.quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product_id: productId,
      quantity: quantity
    });
  }

  // Calculate total price
  await cart.save();
  return findCartByUser(userId);
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await findCartByUser(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(item => 
    item.product_id.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  // Check product availability
  const product = await Product.findById(productId);
  if (!product || !product.is_active) {
    throw new Error("Product not available");
  }

  if (quantity > product.quantity) {
    throw new Error("Insufficient product quantity available");
  }

  item.quantity = quantity;
  await cart.save();
  return findCartByUser(userId);
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await findCartByUser(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(item => 
    item.product_id.toString() !== productId.toString()
  );

  await cart.save();
  return findCartByUser(userId);
};

export const clearCart = async (userId) => {
  const cart = await findCartByUser(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();
  return findCartByUser(userId);
};

export const getCartWithCalculatedTotals = async (userId) => {
  const cart = await findCartByUser(userId);
  if (!cart) {
    return null;
  }

  // Calculate total price
  let totalPrice = 0;
  cart.items.forEach(item => {
    if (item.product_id && item.product_id.price) {
      totalPrice += item.product_id.price * item.quantity;
    }
  });

  return {
    ...cart.toObject(),
    calculated_total_price: totalPrice
  };
};
