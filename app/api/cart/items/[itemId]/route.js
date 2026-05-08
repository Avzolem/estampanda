import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Cart from "@/models/Cart";
import Design from "@/models/Design";
import { getOrCreateSession } from "@/libs/session";
import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";

// Catálogos: duplicación temporal con app/api/cart/items/route.js
// TODO post-MVP: extraer a libs/catalog.js
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

function calculateDpi(widthPx, widthCm) {
  return Math.round((widthPx / widthCm) * 2.54);
}

export async function PATCH(req, { params }) {
  const { itemId } = await params;
  const sessionId = await getOrCreateSession();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  await connectMongo();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.id(itemId);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  // Aplicar patch a la config
  if (body.material?.id) {
    const m = MATERIALS[body.material.id];
    if (!m) return NextResponse.json({ error: "Material inválido" }, { status: 400 });
    item.material = { id: body.material.id, name: m.name, priceMultiplier: m.priceMultiplier };
  }
  if (body.cutType?.id) {
    const c = CUT_TYPES[body.cutType.id];
    if (!c) return NextResponse.json({ error: "Tipo de corte inválido" }, { status: 400 });
    item.cutType = { id: body.cutType.id, name: c.name, priceMultiplier: c.priceMultiplier };
  }
  if (body.size?.width || body.size?.height) {
    item.size = {
      width: Number(body.size.width ?? item.size.width),
      height: Number(body.size.height ?? item.size.height),
      label: body.size.label ?? item.size.label,
      custom: body.size.custom ?? item.size.custom,
    };
  }
  if (body.quantity !== undefined) {
    const q = Number(body.quantity);
    if (q < 1) return NextResponse.json({ error: "Cantidad mínima: 1" }, { status: 400 });
    item.quantity = q;
  }

  // Recalcular precio + DPI
  item.unitPrice = calculateUnitPrice({
    size: item.size,
    material: item.material,
    cutType: item.cutType,
    quantity: item.quantity,
  });
  item.totalPrice = calculateTotalPrice({
    size: item.size,
    material: item.material,
    cutType: item.cutType,
    quantity: item.quantity,
  });

  const design = await Design.findById(item.designId);
  if (design) {
    item.dpi = calculateDpi(design.dimensions.width, item.size.width);
    item.dpiWarning = item.dpi < 300;
  }
  item.updatedAt = new Date();

  await cart.save();
  return NextResponse.json({ cart: cart.toJSON() });
}

export async function DELETE(req, { params }) {
  const { itemId } = await params;
  const sessionId = await getOrCreateSession();

  await connectMongo();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.id(itemId);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  cart.items.pull(itemId);
  await cart.save();
  return NextResponse.json({ cart: cart.toJSON() });
}
