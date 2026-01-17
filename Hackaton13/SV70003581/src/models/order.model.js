import mongoose, { Schema, Types } from "mongoose";

const OrderSchema = new Schema(
  {
    products: [{
      type: String,
      trim: true,
    },],    
    customerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("orders", OrderSchema);

export { OrderModel };
