import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.replace(/^@/, "").trim();

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  try {
    let profilePicUrl: string | null = null;

    // 1. Fetch Instagram profile with Facebook crawler user agent to bypass login wall
    try {
      const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const html = await res.text();
        const match =
          html.match(/content="([^"]+cdninstagram\.com[^"]+)"/i) ||
          html.match(/property="og:image"\s+content="([^"]+)"/i) ||
          html.match(/content="([^"]+)"\s+property="og:image"/i);

        if (match && match[1]) {
          profilePicUrl = match[1].replace(/&amp;/g, "&");
        }
      }
    } catch {
      // Fallback
    }

    // 2. Fallback: unavatar / Google proxy if not found
    if (!profilePicUrl) {
      profilePicUrl = `https://unavatar.io/instagram/${encodeURIComponent(username)}`;
    }

    // 3. Fetch the image binary and stream directly to client
    const imageRes = await fetch(profilePicUrl, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      },
    });

    if (imageRes.ok) {
      const buffer = await imageRes.arrayBuffer();
      const contentType = imageRes.headers.get("content-type") || "image/jpeg";
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        },
      });
    }

    // 4. Fallback robot avatar if user does not exist
    const fallbackRes = await fetch(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`);
    const fallbackBuffer = await fallbackRes.arrayBuffer();
    return new NextResponse(fallbackBuffer, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    console.error("IG Avatar Fetch Error:", error);
    return NextResponse.redirect(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`);
  }
}
