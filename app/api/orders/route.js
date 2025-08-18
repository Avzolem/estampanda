import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

// GET - Obtener pedidos (con filtros opcionales)
export async function GET(req) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const isAdmin = searchParams.get("admin") === "true";

    await connectMongo();

    // Verificar si el usuario es admin
    const user = await User.findById(session.user.id);
    const userIsAdmin = user?.role === "admin";

    // Construir query
    const query = {};
    
    // Si no es admin, solo ver sus propios pedidos
    if (!userIsAdmin || !isAdmin) {
      query.userId = session.user.id;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.phone": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("userId", "name email image")
        .sort(sortOptions)
        .limit(limit)
        .skip(skip)
        .lean(),
      Order.countDocuments(query),
    ]);

    // Calcular estadísticas si es admin
    let stats = null;
    if (userIsAdmin && isAdmin) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const [todayOrders, monthOrders, totalRevenue] = await Promise.all([
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({ createdAt: { $gte: thisMonth } }),
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

      stats = {
        todayOrders,
        monthOrders,
        totalOrders: total,
        totalRevenue: totalRevenue[0]?.total || 0,
      };
    }

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo pedido
export async function POST(req) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validar datos requeridos
    const requiredFields = [
      "designUrl",
      "material",
      "size",
      "cutType",
      "quantity",
      "unitPrice",
      "totalPrice",
      "shippingAddress",
      "paymentMethod",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await connectMongo();

    // Generar número de orden único
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const orderNumber = `STK-${year}${month}${day}-${random}`;

    // Calcular fecha estimada de entrega (5-7 días hábiles)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Crear el pedido
    const order = await Order.create({
      userId: session.user.id,
      orderNumber,
      designUrl: body.designUrl,
      designThumbnail: body.designThumbnail || body.designUrl,
      designId: body.designId,
      material: body.material,
      size: body.size,
      cutType: body.cutType,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalPrice: body.totalPrice,
      discount: body.discount || 0,
      couponUsed: body.couponUsed,
      notes: body.notes,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress || body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentIntentId: body.paymentIntentId || `temp_${Date.now()}`, // Temporal hasta integrar Stripe
      estimatedDelivery,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          date: new Date(),
          note: "Pedido recibido",
        },
      ],
    });

    // Populate user data
    await order.populate("userId", "name email image");

    return NextResponse.json({
      success: true,
      order: order.toJSON(),
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order: " + error.message },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar pedidos en batch (para admin)
export async function PATCH(req) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    // Verificar si es admin
    const user = await User.findById(session.user.id);
    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { orderIds, updates } = await req.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "No orders specified" },
        { status: 400 }
      );
    }

    // Actualizar pedidos
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: updates,
        $push: updates.status ? {
          statusHistory: {
            status: updates.status,
            date: new Date(),
            note: updates.statusNote || `Status changed by admin`,
          }
        } : undefined
      }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update orders error:", error);
    return NextResponse.json(
      { error: "Failed to update orders" },
      { status: 500 }
    );
  }
}