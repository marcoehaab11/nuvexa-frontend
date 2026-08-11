import type { NextRequest } from "next/server";

const apiBase = () => (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

export async function proxyBackend(request: NextRequest, path: string) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  const upstream = await fetch(`${apiBase()}${path}`, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });
  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  const setCookie = upstream.headers.get("set-cookie");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);
  if (setCookie) responseHeaders.set("set-cookie", setCookie);
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}
