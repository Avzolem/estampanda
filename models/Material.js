import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const materialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    priceMultiplier: {
      type: Number,
      required: true,
      default: 1,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    galleryImages: [String],
    properties: {
      finish: {
        type: String,
        enum: ["matte", "glossy", "satin", "special"],
      },
      durability: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
      },
      thickness: {
        type: String,
      },
      adhesiveType: {
        type: String,
      },
      waterproof: {
        type: Boolean,
        default: false,
      },
      uvResistant: {
        type: Boolean,
        default: false,
      },
      dishwasherSafe: {
        type: Boolean,
        default: false,
      },
      outdoorSuitable: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    stock: {
      available: {
        type: Boolean,
        default: true,
      },
      quantity: Number,
      lowStockAlert: Number,
    },
  },
  {
    timestamps: true,
  }
);

materialSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }
  next();
});

materialSchema.plugin(toJSON);

export default mongoose.models.Material || mongoose.model("Material", materialSchema);