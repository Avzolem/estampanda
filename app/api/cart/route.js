import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Cart from "@/models/Cart";
import Design from "@/models/Design";
import { getOrCreateSession } from "@/libs/session";

/**
 * Hidrata items con su Design completo.
 */
async function hydrateCart(cart) {
  const json = cart.toJSON();
  const designIds = cart.items.map((i) => i.designId);
  const designs = await Design.find({ _id: { $in: designIds } });
  const byId = new Map(designs.map((d) => [String(d._id), d.toJSON()]));
  json.items = json.items.map((item) => ({
    ...item,
    design: byId.get(String(item.designId)) ?? null,
  }));
  return json;
}

export async function GET() {
  const sessionId = await getOrCreateSession();
  await connectMongo();

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  } else {
    // touch expiresAt
    await cart.save();
  }

  return NextResponse.json({ cart: await hydrateCart(cart) });
}
