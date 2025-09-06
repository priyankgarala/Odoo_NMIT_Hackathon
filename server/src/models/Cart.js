import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
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
  added_at: { 
    type: Date, 
    default: Date.now 
  }
});

const cartSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },
  items: [cartItemSchema],
  total_items: { 
    type: Number, 
    default: 0 
  },
  total_price: { 
    type: Number, 
    default: 0 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Update totals before saving
cartSchema.pre('save', function(next) {
  this.total_items = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.updated_at = new Date();
  next();
});

export default mongoose.model("Cart", cartSchema);
