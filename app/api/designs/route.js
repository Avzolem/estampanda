import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectMongo from "@/libs/mongoose";
import Design from "@/models/Design";
import { getOrCreateSession } from "@/libs/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req) {
  const sessionId = await getOrCreateSession();
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = ["cloudinaryPublicId", "originalFileUrl", "width", "height", "fileType", "fileSize"];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  // Anti-spoofing: verificar el publicId existe realmente en Cloudinary
  let resource;
  try {
    resource = await cloudinary.api.resource(body.cloudinaryPublicId);
  } catch {
    return NextResponse.json({ error: "Asset not found in Cloudinary" }, { status: 400 });
  }
  if (resource.width !== body.width || resource.height !== body.height) {
    return NextResponse.json({ error: "Asset dimensions mismatch" }, { status: 400 });
  }

  await connectMongo();
  const design = await Design.create({
    sessionId,
    name: body.name || "Sin título",
    cloudinaryPublicId: body.cloudinaryPublicId,
    cloudinaryFolder: "estampanda/temp",
    originalFileUrl: body.originalFileUrl,
    thumbnailUrl: body.thumbnailUrl,
    previewUrl: body.previewUrl,
    fileType: body.fileType.toLowerCase(),
    fileSize: body.fileSize,
    dimensions: { width: body.width, height: body.height },
    hasTransparency: !!body.hasTransparency,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return NextResponse.json({ design: design.toJSON() }, { status: 201 });
}

export async function GET(req) {
  const sessionId = await getOrCreateSession();
  await connectMongo();

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "active";

  const designs = await Design.find({ sessionId, status }).sort({ createdAt: -1 });

  return NextResponse.json({
    designs: designs.map((d) => d.toJSON()),
    total: designs.length,
  });
}
