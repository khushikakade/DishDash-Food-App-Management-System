import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl = (
  process.env.BACKEND_API_URL ||
  (process.env.BACKEND_HOSTPORT
    ? `http://${process.env.BACKEND_HOSTPORT}`
    : "http://localhost:5000")
).replace(/\/$/, "");

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path.join("/");
  const search = request.nextUrl.search || "";
  const targetUrl = `${backendBaseUrl}/api/${targetPath}${search}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers: requestHeaders,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}
