// Create a new order (checkout)
export const createOrder = async (axiosInstance, orderData = {}) => {
  const { data } = await axiosInstance.post('/api/orders', orderData);
  return data;
};

// Get user's previous purchases (orders) with pagination
export const getUserOrders = async (axiosInstance, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get('/api/orders', {
    params: { page, limit }
  });
  return data;
};

// Get a specific order by ID
export const getOrderById = async (axiosInstance, orderId) => {
  const { data } = await axiosInstance.get(`/api/orders/${orderId}`);
  return data;
};

// Get user's order statistics
export const getUserOrderStats = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/orders/stats/summary');
  return data;
};

// Get recent purchases
export const getRecentPurchases = async (axiosInstance, limit = 5) => {
  const { data } = await axiosInstance.get('/api/orders/recent/purchases', {
    params: { limit }
  });
  return data;
};

