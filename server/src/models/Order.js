import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price_at_purchase: { 
    type: Number, 
    required: true 
  },
  product_name: { 
    type: String, 
    required: true 
  },
  product_image: { 
    type: String 
  }
});

const orderSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [orderItemSchema],
  total_amount: { 
    type: Number, 
    required: true 
  },
  total_items: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "completed", "cancelled", "shipped", "delivered"], 
    default: "completed" 
  },
  order_date: { 
    type: Date, 
    default: Date.now 
  },
  shipping_address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  payment_method: { 
    type: String, 
    enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"], 
    default: "credit_card" 
  },
  payment_status: { 
    type: String, 
    enum: ["pending", "completed", "failed", "refunded"], 
    default: "completed" 
  }
}, { timestamps: true });

// Index for efficient queries
orderSchema.index({ user_id: 1, order_date: -1 });

export default mongoose.model("Order", orderSchema);
