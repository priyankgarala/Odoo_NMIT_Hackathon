export const getCart = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/cart');
  return data;
};

export const addToCart = async (axiosInstance, productId, quantity = 1) => {
  const { data } = await axiosInstance.post('/api/cart/add', {
    productId,
    quantity
  });
  return data;
};

export const updateCartItem = async (axiosInstance, productId, quantity) => {
  const { data } = await axiosInstance.put(`/api/cart/item/${productId}`, {
    quantity
  });
  return data;
};

export const removeFromCart = async (axiosInstance, productId) => {
  const { data } = await axiosInstance.delete(`/api/cart/item/${productId}`);
  return data;
};

export const clearCart = async (axiosInstance) => {
  const { data } = await axiosInstance.delete('/api/cart/clear');
  return data;
};

export const getCartCount = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/cart/count');
  return data;
};
