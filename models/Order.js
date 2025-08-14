import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    designUrl: {
      type: String,
      required: true,
    },
    designThumbnail: {
      type: String,
    },
    material: {
      type: String,
      required: true,
      enum: ["matte", "glossy", "transparent", "holographic", "glow-in-dark", "metallic"],
    },
    size: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: "cm",
      },
    },
    cutType: {
      type: String,
      required: true,
      enum: ["square", "round", "oval", "diecut", "custom"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponUsed: {
      type: String,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "processing", "printing", "cutting", "quality-check", "shipped", "delivered", "cancelled"],
    },
    statusHistory: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    billingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    trackingNumber: {
      type: String,
    },
    proofUrl: {
      type: String,
    },
    mockupUrls: [String],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    this.orderNumber = `STK-${year}${month}${day}-${random}`;
  }
  
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
    });
  }
  
  next();
});

orderSchema.plugin(toJSON);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);