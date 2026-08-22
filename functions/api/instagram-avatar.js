/**
 * Cloudflare Pages Function: /api/instagram-avatar
 * Runs natively on Cloudflare Edge Network (unblocked by Instagram)
 */
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const username = url.searchParams.get("username")?.replace(/^@/, "").trim().toLowerCase();

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const urlMatches = html.match(/https:\/\/[^"'\s\\<>]*cdninstagram\.com\/v\/[^"'\s\\<>]*/gi);
      if (urlMatches && urlMatches.length > 0) {
        const picUrl = urlMatches.find((m) => !m.includes("rsrc.php"));
        if (picUrl) {
          const cleanUrl = picUrl.replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
          return Response.redirect(`https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`, 302);
        }
      }
    }
  } catch (err) {
    // ignore
  }

  // Fallback to vibrant initials avatar
  return Response.redirect(
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=f97316,e11d48,8b5cf6,06b6d4,10b981&textColor=ffffff`,
    302
  );
}
