import type { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/backend-proxy";

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyBackend(request, `/api/${path.join("/")}${request.nextUrl.search}`);
}
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
