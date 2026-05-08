import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const designSchema = mongoose.Schema(
  {
    // Identidad: uno de los dos requerido (validación pre-save)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
      index: true,
    },

    name: {
      type: String,
      required: true,
      default: "Sin título",
    },

    // Cloudinary
    cloudinaryPublicId: { type: String, required: true },
    cloudinaryProcessedPublicId: { type: String },
    cloudinaryFolder: { type: String },

    originalFileUrl: { type: String, required: true },
    thumbnailUrl: String,
    previewUrl: String,
    processedFileUrl: String,

    // Metadata de archivo
    fileType: {
      type: String,
      required: true,
      enum: ["jpg", "jpeg", "png", "svg", "webp"],
    },
    fileSize: { type: Number, required: true },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    hasTransparency: { type: Boolean, default: false },

    // Estado
    status: {
      type: String,
      default: "active",
      enum: ["active", "deleted"],
    },
    processingStatus: {
      backgroundRemoved: { type: Boolean, default: false },
      optimized: { type: Boolean, default: true },
    },

    // Lifecycle: null = no expira (vinculado a Order pagada)
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true }
);

designSchema.index({ sessionId: 1, status: 1 });
designSchema.index({ userId: 1, status: 1 });

designSchema.pre("save", function (next) {
  if (!this.userId && !this.sessionId) {
    return next(new Error("Design requires either userId or sessionId"));
  }
  next();
});

designSchema.plugin(toJSON);

export default mongoose.models.Design || mongoose.model("Design", designSchema);
