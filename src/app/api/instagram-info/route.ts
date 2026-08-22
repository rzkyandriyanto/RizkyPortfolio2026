import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.replace(/^@/, "").trim();

  if (!username) {
    return NextResponse.json({ isVerified: false });
  }

  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const html = await res.text();
      const isVerified = /"is_verified":\s*true/i.test(html) || /"is_verified":true/i.test(html);
      return NextResponse.json({ isVerified, username });
    }

    return NextResponse.json({ isVerified: false, username });
  } catch (error) {
    console.error("IG Verify Check Error:", error);
    return NextResponse.json({ isVerified: false, username });
  }
}
