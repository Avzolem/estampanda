import { NextResponse } from "next/server";
import { auth } from "@/libs/simple-auth";
import connectMongo from "@/libs/mongoose";
import Design from "@/models/Design";
import Cart from "@/models/Cart";

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/dashboard
 * Devuelve stats reales del sistema. Solo admin autenticado.
 *
 * Stats:
 *   - designs: total, last24h, lastWeek, withBgRemoved
 *   - carts: active (con items > 0), empty, totalItems, totalValue
 *   - recentDesigns: últimos 8 (para activity feed)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalDesigns,
      designsLast24h,
      designsLastWeek,
      designsBgRemoved,
      activeCarts,
      emptyCarts,
      cartItemsAgg,
      recentDesigns,
    ] = await Promise.all([
      Design.countDocuments({ status: "active" }),
      Design.countDocuments({
        status: "active",
        createdAt: { $gte: last24h },
      }),
      Design.countDocuments({
        status: "active",
        createdAt: { $gte: lastWeek },
      }),
      Design.countDocuments({
        status: "active",
        "processingStatus.backgroundRemoved": true,
      }),
      Cart.countDocuments({ "items.0": { $exists: true } }),
      Cart.countDocuments({ items: { $size: 0 } }),
      Cart.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            count: { $sum: "$items.quantity" },
            value: { $sum: "$items.totalPrice" },
          },
        },
      ]),
      Design.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(8)
        .select(
          "name thumbnailUrl createdAt processingStatus dimensions sessionId"
        )
        .lean(),
    ]);

    const totalCartItems = cartItemsAgg[0]?.count ?? 0;
    const totalCartValue = cartItemsAgg[0]?.value ?? 0;

    return NextResponse.json({
      data: {
        designs: {
          total: totalDesigns,
          last24h: designsLast24h,
          lastWeek: designsLastWeek,
          withBgRemoved: designsBgRemoved,
        },
        carts: {
          active: activeCarts,
          empty: emptyCarts,
          totalItems: totalCartItems,
          totalValue: totalCartValue,
        },
        recentDesigns: recentDesigns.map((d) => ({
          id: String(d._id),
          name: d.name,
          thumbnailUrl: d.thumbnailUrl,
          createdAt: d.createdAt,
          backgroundRemoved: d.processingStatus?.backgroundRemoved ?? false,
          dimensions: d.dimensions,
          sessionPrefix: d.sessionId ? d.sessionId.slice(0, 8) : null,
        })),
      },
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
