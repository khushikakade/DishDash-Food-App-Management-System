import { NextResponse } from "next/server";
import { BackendRequestError, fetchBackend } from "@/lib/backend";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  MenuItems?: unknown[];
};

type OrderItem = {
  name: string;
  quantity: number;
  price: number | string;
};

type Order = {
  id: number;
  totalPrice: number | string;
  status: "Pending" | "Preparing" | "Delivered" | "Cancelled";
  createdAt?: string;
  Restaurant?: {
    name?: string;
  };
  OrderItems?: OrderItem[];
};

type Product = {
  id: number;
  name: string;
};

type Platform = {
  id: number;
  name: string;
};

const toAmount = (value: number | string) =>
  typeof value === "number" ? value : Number.parseFloat(value || "0");

export async function GET() {
  try {
    const [products, restaurants, orders, platforms] = await Promise.all([
      fetchBackend<Product[]>("/api/products"),
      fetchBackend<Restaurant[]>("/api/restaurants"),
      fetchBackend<Order[]>("/api/orders"),
      fetchBackend<Platform[]>("/api/platforms"),
    ]);

    const sortedOrders = [...orders].sort((a, b) => {
      const left = new Date(b.createdAt || 0).getTime();
      const right = new Date(a.createdAt || 0).getTime();
      return left - right;
    });

    const revenue = orders.reduce(
      (sum, order) => sum + toAmount(order.totalPrice),
      0
    );

    const statusBreakdown = orders.reduce<Record<string, number>>(
      (counts, order) => {
        counts[order.status] = (counts[order.status] || 0) + 1;
        return counts;
      },
      {}
    );

    const cuisineBreakdown = restaurants.reduce<Record<string, number>>(
      (counts, restaurant) => {
        counts[restaurant.cuisine] = (counts[restaurant.cuisine] || 0) + 1;
        return counts;
      },
      {}
    );

    return NextResponse.json({
      stats: {
        ordersCount: orders.length,
        revenue,
        pendingOrders: statusBreakdown.Pending || 0,
        productsCount: products.length,
        restaurantsCount: restaurants.length,
        platformsCount: platforms.length,
      },
      products: products.slice(0, 12),
      productNames: products.map((product) => product.name),
      restaurants: restaurants.slice(0, 6).map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        menuCount: restaurant.MenuItems?.length || 0,
      })),
      recentOrders: sortedOrders.slice(0, 6).map((order) => ({
        id: order.id,
        totalPrice: toAmount(order.totalPrice),
        status: order.status,
        createdAt: order.createdAt,
        restaurantName: order.Restaurant?.name || "Unknown restaurant",
        itemCount: order.OrderItems?.length || 0,
      })),
      statusBreakdown,
      cuisineBreakdown,
      platforms: platforms.map((platform) => platform.name),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load dashboard data";
    const status = error instanceof BackendRequestError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
