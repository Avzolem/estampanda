import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const stickerConfigurationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    size: {
      width: {
        type: Number,
        required: true,
        min: 3,
        max: 30,
      },
      height: {
        type: Number,
        required: true,
        min: 3,
        max: 30,
      },
      unit: {
        type: String,
        default: "cm",
        enum: ["cm", "inch"],
      },
      isCustom: {
        type: Boolean,
        default: false,
      },
    },
    cutType: {
      type: String,
      required: true,
      enum: ["square", "round", "oval", "diecut", "custom"],
    },
    cutPath: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10000,
      default: 50,
    },
    finish: {
      lamination: {
        type: Boolean,
        default: false,
      },
      uvCoating: {
        type: Boolean,
        default: false,
      },
      embossing: {
        type: Boolean,
        default: false,
      },
    },
    proofRequested: {
      type: Boolean,
      default: false,
    },
    rushOrder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      deliveryDate: Date,
    },
    pricing: {
      basePrice: Number,
      materialCost: Number,
      cutTypeCost: Number,
      finishCost: Number,
      rushCost: Number,
      volumeDiscount: Number,
      volumeDiscountPercentage: Number,
      subtotal: Number,
      tax: Number,
      shipping: Number,
      total: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    designPositioning: {
      scale: {
        type: Number,
        default: 1,
        min: 0.1,
        max: 3,
      },
      rotation: {
        type: Number,
        default: 0,
        min: -360,
        max: 360,
      },
      offsetX: {
        type: Number,
        default: 0,
      },
      offsetY: {
        type: Number,
        default: 0,
      },
      flipHorizontal: {
        type: Boolean,
        default: false,
      },
      flipVertical: {
        type: Boolean,
        default: false,
      },
    },
    previewUrls: {
      flat: String,
      mockup: String,
      threeDimensional: String,
      animated: String,
    },
    isTemporary: {
      type: Boolean,
      default: true,
    },
    savedAsTemplate: {
      type: Boolean,
      default: false,
    },
    templateName: String,
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    completedAt: Date,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

stickerConfigurationSchema.index({ sessionId: 1 });
stickerConfigurationSchema.index({ userId: 1, isTemporary: 1 });
stickerConfigurationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

stickerConfigurationSchema.methods.calculatePricing = async function () {
  const PricingRule = mongoose.model("PricingRule");
  const Material = mongoose.model("Material");
  
  const rule = await PricingRule.findApplicableRule(
    this.size.width,
    this.size.height,
    this.size.unit
  );
  
  if (!rule) {
    throw new Error("No pricing rule found for this size");
  }
  
  const material = await Material.findById(this.material);
  if (!material) {
    throw new Error("Material not found");
  }
  
  const basePrice = rule.calculatePrice(
    this.quantity,
    material.slug,
    this.cutType,
    this.rushOrder?.enabled
  );
  
  let finishCost = 0;
  if (this.finish.lamination) finishCost += basePrice * 0.15;
  if (this.finish.uvCoating) finishCost += basePrice * 0.20;
  if (this.finish.embossing) finishCost += basePrice * 0.25;
  
  const subtotal = basePrice + finishCost;
  const tax = subtotal * 0.08;
  
  let shipping = 0;
  if (this.quantity < 100) shipping = 5.99;
  else if (this.quantity < 500) shipping = 9.99;
  else if (this.quantity < 1000) shipping = 14.99;
  else shipping = 0;
  
  this.pricing = {
    basePrice: Math.round(basePrice * 100) / 100,
    materialCost: material.priceMultiplier,
    cutTypeCost: rule.cutTypeMultipliers[this.cutType] || 1,
    finishCost: Math.round(finishCost * 100) / 100,
    rushCost: this.rushOrder?.enabled ? rule.rushOrderMultiplier : 0,
    volumeDiscount: 0,
    volumeDiscountPercentage: 0,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: shipping,
    total: Math.round((subtotal + tax + shipping) * 100) / 100,
    currency: "USD",
  };
  
  const applicableDiscount = rule.volumeDiscounts.find(
    (discount) =>
      this.quantity >= discount.minQuantity &&
      (!discount.maxQuantity || this.quantity <= discount.maxQuantity)
  );
  
  if (applicableDiscount) {
    this.pricing.volumeDiscountPercentage = applicableDiscount.discountPercentage;
    this.pricing.volumeDiscount = (basePrice * applicableDiscount.discountPercentage) / 100;
  }
  
  return this.pricing;
};

stickerConfigurationSchema.methods.generatePreviews = async function () {
  this.previewUrls = {
    flat: `/api/preview/flat/${this._id}`,
    mockup: `/api/preview/mockup/${this._id}`,
    threeDimensional: `/api/preview/3d/${this._id}`,
    animated: `/api/preview/animated/${this._id}`,
  };
  return this.save();
};

stickerConfigurationSchema.plugin(toJSON);

export default mongoose.models.StickerConfiguration || mongoose.model("StickerConfiguration", stickerConfigurationSchema);