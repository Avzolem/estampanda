import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const designSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalFileUrl: {
      type: String,
      required: true,
    },
    processedFileUrl: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["jpg", "jpeg", "png", "svg", "ai", "pdf", "eps"],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    dimensions: {
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
        default: "px",
      },
      dpi: {
        type: Number,
        default: 300,
      },
    },
    hasTransparency: {
      type: Boolean,
      default: false,
    },
    colors: [
      {
        hex: String,
        rgb: {
          r: Number,
          g: Number,
          b: Number,
        },
        percentage: Number,
      },
    ],
    tags: [String],
    category: {
      type: String,
      enum: ["personal", "business", "art", "meme", "text", "logo", "illustration", "photo", "other"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "archived", "deleted", "processing", "error"],
    },
    processingStatus: {
      backgroundRemoved: {
        type: Boolean,
        default: false,
      },
      vectorized: {
        type: Boolean,
        default: false,
      },
      optimized: {
        type: Boolean,
        default: false,
      },
    },
    metadata: {
      software: String,
      camera: String,
      location: String,
      dateCreated: Date,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: String,
    lastUsed: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

designSchema.index({ userId: 1, status: 1 });
designSchema.index({ isPublic: 1, category: 1 });
designSchema.index({ tags: 1 });

designSchema.pre("save", function (next) {
  if (this.isModified("originalFileUrl")) {
    const extension = this.originalFileUrl.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "svg", "ai", "pdf", "eps"].includes(extension)) {
      this.fileType = extension === "jpeg" ? "jpg" : extension;
    }
  }
  next();
});

designSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

designSchema.plugin(toJSON);

export default mongoose.models.Design || mongoose.model("Design", designSchema);