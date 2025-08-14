import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumPurchase: {
      type: Number,
      default: 0,
    },
    maximumDiscount: {
      type: Number,
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    usageLimitPerUser: {
      type: Number,
      default: 1,
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      },
    ],
    applicableProducts: {
      materials: [String],
      sizes: [String],
      cutTypes: [String],
    },
    excludedProducts: {
      materials: [String],
      sizes: [String],
      cutTypes: [String],
    },
    conditions: {
      firstTimeCustomer: {
        type: Boolean,
        default: false,
      },
      minimumQuantity: Number,
      specificUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAutoApply: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.pre("save", function (next) {
  if (this.isModified("code")) {
    this.code = this.code.toUpperCase().replace(/\s+/g, "");
  }
  next();
});

couponSchema.methods.isValid = function () {
  const now = new Date();
  
  if (!this.isActive) return false;
  if (this.validFrom > now) return false;
  if (this.validUntil < now) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  
  return true;
};

couponSchema.methods.canBeUsedByUser = function (userId) {
  if (!this.isValid()) return false;
  
  const userUsage = this.usedBy.filter(
    (usage) => usage.userId.toString() === userId.toString()
  );
  
  if (userUsage.length >= this.usageLimitPerUser) {
    return false;
  }
  
  if (
    this.conditions.specificUsers &&
    this.conditions.specificUsers.length > 0 &&
    !this.conditions.specificUsers.some((id) => id.toString() === userId.toString())
  ) {
    return false;
  }
  
  return true;
};

couponSchema.methods.calculateDiscount = function (subtotal, quantity, material, cutType) {
  if (!this.isValid()) return 0;
  
  if (subtotal < this.minimumPurchase) return 0;
  
  if (this.conditions.minimumQuantity && quantity < this.conditions.minimumQuantity) {
    return 0;
  }
  
  if (this.applicableProducts.materials.length > 0 && !this.applicableProducts.materials.includes(material)) {
    return 0;
  }
  
  if (this.excludedProducts.materials.length > 0 && this.excludedProducts.materials.includes(material)) {
    return 0;
  }
  
  if (this.applicableProducts.cutTypes.length > 0 && !this.applicableProducts.cutTypes.includes(cutType)) {
    return 0;
  }
  
  if (this.excludedProducts.cutTypes.length > 0 && this.excludedProducts.cutTypes.includes(cutType)) {
    return 0;
  }
  
  let discount = 0;
  
  if (this.discountType === "percentage") {
    discount = (subtotal * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }
  
  if (this.maximumDiscount && discount > this.maximumDiscount) {
    discount = this.maximumDiscount;
  }
  
  return Math.min(discount, subtotal);
};

couponSchema.methods.applyUsage = function (userId, orderId) {
  this.usageCount += 1;
  this.usedBy.push({
    userId,
    orderId,
    usedAt: new Date(),
  });
  return this.save();
};

couponSchema.statics.findAutoApplicable = async function (userId, subtotal, quantity, material, cutType) {
  const coupons = await this.find({
    isActive: true,
    isAutoApply: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  }).sort({ priority: -1 });
  
  for (const coupon of coupons) {
    if (coupon.canBeUsedByUser(userId)) {
      const discount = coupon.calculateDiscount(subtotal, quantity, material, cutType);
      if (discount > 0) {
        return coupon;
      }
    }
  }
  
  return null;
};

couponSchema.plugin(toJSON);

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);