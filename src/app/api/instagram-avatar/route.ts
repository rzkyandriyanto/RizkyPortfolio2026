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
        // Extract direct Instagram CDN profile picture URL
        const urlMatches = html.match(/https:\/\/[^"'\s\\<>]*cdninstagram\.com\/v\/[^"'\s\\<>]*/gi);
        if (urlMatches && urlMatches.length > 0) {
          const picUrl = urlMatches.find((m) => !m.includes("rsrc.php"));
          if (picUrl) {
            profilePicUrl = picUrl.replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
          }
        }

        if (!profilePicUrl) {
          const match =
            html.match(/content="([^"]+cdninstagram\.com[^"]+)"/i) ||
            html.match(/property="og:image"\s+content="([^"]+)"/i) ||
            html.match(/content="([^"]+)"\s+property="og:image"/i);
          if (match && match[1]) {
            profilePicUrl = match[1].replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
          }
        }
      }
    } catch {
      // Fallback
    }

    // 2. Fallback: unavatar if not found
    if (!profilePicUrl) {
      profilePicUrl = `https://unavatar.io/instagram/${encodeURIComponent(username)}`;
    }

    // 3. Redirect the client browser directly to the profile picture URL.
    // This allows the browser to download the image using the user's own IP address,
    // bypassing Vercel server IP blocks and rate limits on unavatar.io.
    return NextResponse.redirect(profilePicUrl, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("IG Avatar Fetch Error:", error);
    return NextResponse.redirect(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`);
  }
}
