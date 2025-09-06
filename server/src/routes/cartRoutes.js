import { Router } from "express";
import cartController from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart CRUD operations
router.get("/", cartController.get_user_cart);
router.post("/add", cartController.add_to_cart);
router.put("/item/:productId", cartController.update_cart_item);
router.delete("/item/:productId", cartController.remove_from_cart);
router.delete("/clear", cartController.clear_user_cart);
router.get("/count", cartController.get_cart_count);

export default router;
