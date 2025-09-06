import express from 'express';
import {
  create_user_order,
  get_user_orders,
  get_user_order,
  get_user_order_stats,
  get_recent_purchases
} from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new order (checkout)
router.post('/', create_user_order);

// Get user's previous purchases (orders) with pagination
router.get('/', get_user_orders);

// Get a specific order by ID
router.get('/:orderId', get_user_order);

// Get user's order statistics
router.get('/stats/summary', get_user_order_stats);

// Get recent purchases
router.get('/recent/purchases', get_recent_purchases);

export default router;
