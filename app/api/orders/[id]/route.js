import { NextResponse } from "next/server";
import { auth } from "@/libs/simple-auth";
import connectMongo from "@/libs/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

// GET - Obtener un pedido específico
export async function GET(req, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectMongo();

    // Buscar el pedido
    const order = await Order.findById(id)
      .populate("userId", "name email image")
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const user = await User.findById(session.user.id);
    const isAdmin = user?.role === "admin";
    
    // Solo el dueño del pedido o un admin puede verlo
    if (order.userId._id.toString() !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar un pedido específico
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const updates = await req.json();

    await connectMongo();

    // Buscar el pedido
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const user = await User.findById(session.user.id);
    const isAdmin = user?.role === "admin";
    
    // Solo un admin puede actualizar pedidos
    if (!isAdmin) {
      // Los usuarios normales solo pueden actualizar notas de su propio pedido
      if (order.userId.toString() === session.user.id && Object.keys(updates).length === 1 && updates.notes !== undefined) {
        order.notes = updates.notes;
        await order.save();
        
        return NextResponse.json({
          success: true,
          order: order.toJSON(),
        });
      }
      
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Admin puede actualizar cualquier campo
    const allowedUpdates = [
      "status",
      "trackingNumber",
      "proofUrl",
      "mockupUrls",
      "notes",
      "estimatedDelivery",
      "actualDelivery",
    ];

    // Actualizar campos permitidos
    for (const field of allowedUpdates) {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    }

    // Si se actualiza el estado, agregar al historial
    if (updates.status && updates.status !== order.status) {
      order.statusHistory.push({
        status: updates.status,
        date: new Date(),
        note: updates.statusNote || `Status updated to ${updates.status}`,
      });
      order.status = updates.status;
    }

    // Guardar cambios
    await order.save();
    await order.populate("userId", "name email image");

    return NextResponse.json({
      success: true,
      order: order.toJSON(),
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar un pedido
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectMongo();

    // Buscar el pedido
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const user = await User.findById(session.user.id);
    const isAdmin = user?.role === "admin";
    
    // Solo el dueño del pedido o un admin puede cancelarlo
    if (order.userId.toString() !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Solo se pueden cancelar pedidos en estado pending o processing
    if (!["pending", "processing"].includes(order.status)) {
      return NextResponse.json(
        { error: "Order cannot be cancelled in current status" },
        { status: 400 }
      );
    }

    // Cambiar estado a cancelado
    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      date: new Date(),
      note: `Cancelled by ${isAdmin ? "admin" : "customer"}`,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}