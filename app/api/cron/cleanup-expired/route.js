import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectMongo from "@/libs/mongoose";
import Cart from "@/models/Cart";
import Design from "@/models/Design";
import Order from "@/models/Order";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const maxDuration = 60;

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const now = new Date();
  const stats = {
    cartsDeleted: 0,
    designsDeleted: 0,
    designsExtended: 0,
    cloudinaryDeleted: 0,
    cloudinaryFailed: 0,
    errors: [],
  };

  // 1. Borrar carritos expirados
  const expiredCarts = await Cart.find({ expiresAt: { $lt: now } });
  if (expiredCarts.length > 0) {
    await Cart.deleteMany({ _id: { $in: expiredCarts.map((c) => c._id) } });
    stats.cartsDeleted = expiredCarts.length;
  }

  // 2. Limpiar Designs expirados huérfanos
  const expiredDesigns = await Design.find({ expiresAt: { $lt: now }, status: "active" });

  for (const design of expiredDesigns) {
    const inCart = await Cart.exists({ "items.designId": design._id });
    const inOrder = await Order.exists({ designUrl: design.originalFileUrl });

    if (inCart || inOrder) {
      design.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      await design.save();
      stats.designsExtended++;
      continue;
    }

    try {
      await cloudinary.uploader.destroy(design.cloudinaryPublicId);
      if (design.cloudinaryProcessedPublicId) {
        await cloudinary.uploader.destroy(design.cloudinaryProcessedPublicId);
      }
      stats.cloudinaryDeleted++;
    } catch (e) {
      stats.cloudinaryFailed++;
      stats.errors.push({ publicId: design.cloudinaryPublicId, error: e.message });
      continue;
    }

    await Design.deleteOne({ _id: design._id });
    stats.designsDeleted++;
  }

  return NextResponse.json({ ok: true, stats, runAt: now.toISOString() });
}
