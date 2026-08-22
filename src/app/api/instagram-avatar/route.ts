import { NextRequest, NextResponse } from "next/server";

const CF_WORKER_URL = "https://ig-avatar.flovvers21.workers.dev";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.replace(/^@/, "").trim().toLowerCase();

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  // Redirect directly to the Cloudflare Worker scraper
  return NextResponse.redirect(`${CF_WORKER_URL}?username=${encodeURIComponent(username)}`, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}


