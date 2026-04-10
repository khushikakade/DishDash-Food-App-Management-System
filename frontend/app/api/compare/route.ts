import { NextRequest, NextResponse } from "next/server";
import { BackendRequestError, fetchBackend } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const product = request.nextUrl.searchParams.get("product")?.trim();

  if (!product) {
    return NextResponse.json(
      { message: "Product query required" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBackend(
      `/api/products/compare/search?product=${encodeURIComponent(product)}`
    );

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to compare product";
    const status = error instanceof BackendRequestError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
