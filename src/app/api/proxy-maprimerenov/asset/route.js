// File: app/api/proxy-maprimerenov/asset/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const assetUrl = searchParams.get('url');
    if (!assetUrl) {
      return new Response("Missing asset URL", { status: 400 });
    }
    try {
      const response = await fetch(assetUrl);
      if (!response.ok) {
        return new Response(null, { status: response.status });
      }
      
      const contentType = response.headers.get("content-type") || "";
      const arrayBuffer = await response.arrayBuffer();
      
      return new Response(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          // Allow assets to load by setting the CORS header:
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Asset proxy error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  