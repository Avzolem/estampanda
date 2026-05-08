import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Cart from "@/models/Cart";
import Design from "@/models/Design";
import { getOrCreateSession } from "@/libs/session";
import { checkRateLimit } from "@/libs/rate-limit";
import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";

// Catálogos: deben estar sincronizados con MaterialSelector.js / CutTypeSelector.js
// TODO post-MVP: extraer a libs/catalog.js para evitar duplicación con el endpoint de [itemId]
const MATERIALS = {
  matte: { name: "Mate", priceMultiplier: 1 },
  glossy: { name: "Brillante", priceMultiplier: 1.1 },
  transparent: { name: "Transparente", priceMultiplier: 1.3 },
  holographic: { name: "Holográfico", priceMultiplier: 1.5 },
  glow: { name: "Glow in Dark", priceMultiplier: 1.8 },
  metallic: { name: "Metálico", priceMultiplier: 2 },
};
const CUT_TYPES = {
  square: { name: "Cuadrado", priceMultiplier: 1 },
  round: { name: "Redondo", priceMultiplier: 1.1 },
  oval: { name: "Ovalado", priceMultiplier: 1.15 },
  diecut: { name: "Troquelado", priceMultiplier: 1.3 },
  custom: { name: "Personalizado", priceMultiplier: 1.5 },
};

function calculateDpi(designWidthPx, sizeWidthCm) {
  return Math.round((designWidthPx / sizeWidthCm) * 2.54);
}

export async function POST(req) {
  const sessionId = await getOrCreateSession();
  const rl = checkRateLimit(`cart:${sessionId}`, 100, 3600);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { designId, material, size, cutType, quantity } = body;

  if (!designId || !material?.id || !size?.width || !size?.height || !cutType?.id || !quantity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const matSpec = MATERIALS[material.id];
  const cutSpec = CUT_TYPES[cutType.id];
  if (!matSpec || !cutSpec) {
    return NextResponse.json({ error: "Material o tipo de corte inválido" }, { status: 400 });
  }

  await connectMongo();
  const design = await Design.findOne({ _id: designId, sessionId });
  if (!design) {
    return NextResponse.json({ error: "Design no encontrado en tu sesión" }, { status: 404 });
  }

  const matSnapshot = { id: material.id, name: matSpec.name, priceMultiplier: matSpec.priceMultiplier };
  const cutSnapshot = { id: cutType.id, name: cutSpec.name, priceMultiplier: cutSpec.priceMultiplier };
  const sizeSnapshot = {
    width: Number(size.width),
    height: Number(size.height),
    label: size.label,
    custom: !!size.custom,
  };

  const unitPrice = calculateUnitPrice({
    size: sizeSnapshot,
    material: matSnapshot,
    cutType: cutSnapshot,
    quantity: Number(quantity),
  });
  const totalPrice = calculateTotalPrice({
    size: sizeSnapshot,
    material: matSnapshot,
    cutType: cutSnapshot,
    quantity: Number(quantity),
  });
  const dpi = calculateDpi(design.dimensions.width, sizeSnapshot.width);

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }

  cart.items.push({
    designId: design._id,
    material: matSnapshot,
    size: sizeSnapshot,
    cutType: cutSnapshot,
    quantity: Number(quantity),
    unitPrice,
    totalPrice,
    dpi,
    dpiWarning: dpi < 300,
    addedAt: new Date(),
    updatedAt: new Date(),
  });
  await cart.save();

  return NextResponse.json({ cart: cart.toJSON() }, { status: 201 });
}
