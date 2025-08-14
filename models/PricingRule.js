import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const pricingRuleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sizeRange: {
      minWidth: {
        type: Number,
        required: true,
      },
      maxWidth: {
        type: Number,
        required: true,
      },
      minHeight: {
        type: Number,
        required: true,
      },
      maxHeight: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: "cm",
      },
    },
    basePrice: {
      type: Number,
      required: true,
    },
    volumeDiscounts: [
      {
        minQuantity: {
          type: Number,
          required: true,
        },
        maxQuantity: {
          type: Number,
        },
        discountPercentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
    materialMultipliers: {
      matte: {
        type: Number,
        default: 1,
      },
      glossy: {
        type: Number,
        default: 1.1,
      },
      transparent: {
        type: Number,
        default: 1.3,
      },
      holographic: {
        type: Number,
        default: 1.5,
      },
      "glow-in-dark": {
        type: Number,
        default: 1.8,
      },
      metallic: {
        type: Number,
        default: 2,
      },
    },
    cutTypeMultipliers: {
      square: {
        type: Number,
        default: 1,
      },
      round: {
        type: Number,
        default: 1.1,
      },
      oval: {
        type: Number,
        default: 1.15,
      },
      diecut: {
        type: Number,
        default: 1.3,
      },
      custom: {
        type: Number,
        default: 1.5,
      },
    },
    rushOrderMultiplier: {
      type: Number,
      default: 1.5,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
    },
    maxOrderQuantity: {
      type: Number,
      default: 10000,
    },
    isActive: {
      type: Boolean,
      default: true,
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

pricingRuleSchema.methods.calculatePrice = function (quantity, material, cutType, isRush = false) {
  let price = this.basePrice * quantity;
  
  if (this.materialMultipliers[material]) {
    price *= this.materialMultipliers[material];
  }
  
  if (this.cutTypeMultipliers[cutType]) {
    price *= this.cutTypeMultipliers[cutType];
  }
  
  const applicableDiscount = this.volumeDiscounts.find(
    (discount) =>
      quantity >= discount.minQuantity &&
      (!discount.maxQuantity || quantity <= discount.maxQuantity)
  );
  
  if (applicableDiscount) {
    const discountAmount = (price * applicableDiscount.discountPercentage) / 100;
    price -= discountAmount;
  }
  
  if (isRush) {
    price *= this.rushOrderMultiplier;
  }
  
  return Math.round(price * 100) / 100;
};

pricingRuleSchema.statics.findApplicableRule = function (width, height, unit = "cm") {
  return this.findOne({
    isActive: true,
    "sizeRange.minWidth": { $lte: width },
    "sizeRange.maxWidth": { $gte: width },
    "sizeRange.minHeight": { $lte: height },
    "sizeRange.maxHeight": { $gte: height },
    "sizeRange.unit": unit,
  }).sort({ priority: -1 });
};

pricingRuleSchema.plugin(toJSON);

export default mongoose.models.PricingRule || mongoose.model("PricingRule", pricingRuleSchema);