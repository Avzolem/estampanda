import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const cartItemSchema = new mongoose.Schema(
  {
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },

    // Snapshot de configuración (mutable post-add)
    material: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      priceMultiplier: { type: Number, required: true },
    },
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      label: String,
      custom: Boolean,
    },
    cutType: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      priceMultiplier: { type: Number, required: true },
    },
    quantity: { type: Number, required: true, min: 1 },

    // Precio (calculado y persistido al añadir/editar)
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // DPI snapshot
    dpi: Number,
    dpiWarning: { type: Boolean, default: false },

    addedAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { _id: true } // cada item tiene _id para edit/delete
);

const cartSchema = mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [cartItemSchema],

    expiresAt: {
      type: Date,
      required: true,
      index: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

/**
 * Recalcula expiresAt = updatedAt + 24h cada vez que se modifica el carrito.
 */
cartSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next();
});

/**
 * Subtotal virtual (suma de items.totalPrice).
 */
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.plugin(toJSON);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
