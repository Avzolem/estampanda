import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectMongo from "@/libs/mongoose";
import Design from "@/models/Design";
import Cart from "@/models/Cart";
import { getOrCreateSession } from "@/libs/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function PATCH(req, { params }) {
  const { id } = await params;
  const sessionId = await getOrCreateSession();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  await connectMongo();
  const design = await Design.findById(id);
  if (!design || design.sessionId !== sessionId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.processedPublicId) {
    try {
      await cloudinary.api.resource(body.processedPublicId);
    } catch {
      return NextResponse.json({ error: "Processed asset not found" }, { status: 400 });
    }
    design.cloudinaryProcessedPublicId = body.processedPublicId;
    design.processedFileUrl = body.processedFileUrl;
    design.processingStatus.backgroundRemoved = !!body.backgroundRemoved;
  }

  await design.save();
  return NextResponse.json({ design: design.toJSON() });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const sessionId = await getOrCreateSession();

  await connectMongo();
  const design = await Design.findById(id);
  if (!design || design.sessionId !== sessionId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const inCart = await Cart.exists({ "items.designId": design._id });
  if (inCart) {
    return NextResponse.json(
      { error: "Este diseño está en tu carrito. Quítalo primero." },
      { status: 409 }
    );
  }

  try {
    await cloudinary.uploader.destroy(design.cloudinaryPublicId);
    if (design.cloudinaryProcessedPublicId) {
      await cloudinary.uploader.destroy(design.cloudinaryProcessedPublicId);
    }
  } catch (e) {
    return NextResponse.json({ error: "Cloudinary delete failed", details: e.message }, { status: 500 });
  }

  await Design.deleteOne({ _id: design._id });
  return NextResponse.json({ success: true });
}
