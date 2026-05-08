import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getOrCreateSession } from "@/libs/session";
import { checkRateLimit } from "@/libs/rate-limit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const FOLDER_BASE = "estampanda";
const EAGER =
  "c_fit,w_300,h_300,f_webp,q_auto:good|c_fit,w_800,h_800,f_png,q_auto:best";

export async function POST(req) {
  const sessionId = await getOrCreateSession();

  const rl = checkRateLimit(`upload:${sessionId}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Reintenta más tarde." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { contentType, fileSize } = body;

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Tipo de archivo no soportado. Usa JPG, PNG, WebP o SVG." },
      { status: 400 }
    );
  }
  if (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_SIZE) {
    return NextResponse.json(
      { error: "Tamaño inválido. Máximo 50 MB." },
      { status: 400 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `temp/${sessionId}/${crypto.randomUUID()}`;
  const folder = FOLDER_BASE;

  const paramsToSign = {
    timestamp,
    folder,
    public_id: publicId,
    eager: EAGER,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    publicId,
    eager: EAGER,
  });
}
