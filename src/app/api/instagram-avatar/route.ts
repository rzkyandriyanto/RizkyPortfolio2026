import { NextRequest, NextResponse } from "next/server";

// Pre-cached high-resolution Instagram avatars served via Cloudflare global image cache
const KNOWN_AVATARS: Record<string, string> = {
  rzkyandriyanto: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.82787-19%2F773744294_18307543540304333_4161870340803461274_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D104%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3DU0PL2ss0inkQ7kNvwHai8my%26_nc_oc%3DAdqg1O4pggdnA4xxhKf-Hj_L7u-NnAjaLadGH5GCD7ScFN-DXmWJ0hThwVhmLnp9lRs%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_gid%3DjDpbvF9oC9Q9L1I5nfcV8w%26_nc_ss%3D7fa8c%26oh%3D00_AQFbe8sUPscUKUg75xUPOySANC5KFgHpZYYHXLMxwpnfaw%26oe%3D6A8F3DDD",
  prabowo: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F399177462_270670785463582_8854351076451010920_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D1%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3DTBLfObASP1wQ7kNvwHD-0dJ%26_nc_oc%3DAdrAJuq4ZsOtUDoepgB_lm-M3OY9waE6c76xRlsZf6fl2Bmc23SsH_B-eykeywhriPA%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_ss%3D7fa8c%26oh%3D00_AQFXTD1m4qzodNYBhfZgbs7ET2RsmaSkxJRkDB-gfIEiBQ%26oe%3D6A8F12A5",
  aniesbaswedan: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F463471347_3828919604052662_1599730014080808597_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D1%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3D_1OyD3Lp_E0Q7kNvwFDCn0x%26_nc_oc%3DAdp4lzorp5E3gHYJU8iRCdVKR1FkU-QEcioXd72ihuHKSxOwahSX0G6t12dJGFDVAIE%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_ss%3D7fa8c%26oh%3D00_AQHtL6zk3Sp33L0liP4djCyYA8gnFTTSL7774mhmtlz5yg%26oe%3D6A8F18D0",
  ganjar_pranowo: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F347191313_190841940571548_3385634738830516783_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D1%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3DmKuSIce40LQQ7kNvwElh6js%26_nc_oc%3DAdouFIEECanY40hNogoYVarkJtcMteloTw2USd71udiPOS2glorWxyOZgSaWP_KCMHQ%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_ss%3D7fa8c%26oh%3D00_AQEJy1lJEJ6a6If5C8r1ddP2cVbN3iizbvPWLsgMytzTIQ%26oe%3D6A8F36E7",
  ybrap: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.82787-19%2F731645112_18608872096037387_4793832726485001033_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D1%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3DnFjTssJvj_YQ7kNvwFu6LHK%26_nc_oc%3DAdogZ4jhQk41f9LnXhZ0nFlX9-3LCUGFBqcZ3A6PqbHPfuCHGbHXt_n4Rq3zAoxzhpU%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_gid%3DF_hSozfi9ar2PzbzNi2zMw%26_nc_ss%3D7fa8c%26oh%3D00_AQERxeLOOQfUZc9RrXTn9kfOl-VQX-wLMzgJrJ6ZzSNTVg%26oe%3D6A8F34DF",
  windahbasudara: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.82787-19%2F761462365_18399928372092657_2126015193312851278_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D1%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3DQA7FBL03OqgQ7kNvwGA5UjV%26_nc_oc%3DAdqEJzweK-cPt5fBGidxRxRLpMWjLquMeZCokGBCy96MNbqCc5McVE73flvApZLn8PY%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_gid%3DeddG55QVA9o-oGOUb6-4zw%26_nc_ss%3D7fa8c%26oh%3D00_AQF_65mNvTC5K_deMaoSCxSlNgLm7QjqL_QVhMz5pE9FqA%26oe%3D6A8F0E59",
  bahlillahadalia: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F456245711_7919549084833262_3699064924206028229_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D102%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%253D%26_nc_ohc%3D2-zSwSEHAXwQ7kNvwHazqVu%26_nc_oc%3DAdorSKZleud4TyFz4eG4PIpV3BDAmwhUwf_w-NV5Puy0SWJ8qW5R9EkKby8VbkOIvPw%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_ss%3D7fa8c%26oh%3D00_AQFF0HscrqUKT_sSi2aScADgEM9PXaO9bzH-8BXMTuDeVA%26oe%3D6A8F1AFC",
  adihidayatofficial: "https://images.weserv.nl/?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F439226215_389850123921838_8798034956532453522_n.jpg%3Fstp%3Ddst-jpg_s100x100_tt6%26_nc_cat%3D111%26ccb%3D7-5%26_nc_sid%3Dbf7eb4%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy42NDAuQzMifQ%253D%253D%26_nc_ohc%3DKeoZ_m6hVFUQ7kNvwEWgC3N%26_nc_oc%3DAdrc-dsYD0ogDdS-WTEqmaPr6JsWLnuVMayZlvB_v-VPL4Tr6MvUCxcIJAoWFLOfx3M%26_nc_zt%3D24%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_ss%3D7fa8c%26oh%3D00_AQEk35ARg1cVYe8BLHL6EIVLWE_pD4eCrpOeovDd2QyMwQ%26oe%3D6A8F1942",
};

function extractCdnUrl(html: string): string | null {
  const urlMatches = html.match(/https:\/\/[^"'\s\\<>]*cdninstagram\.com\/v\/[^"'\s\\<>]*/gi);
  if (urlMatches && urlMatches.length > 0) {
    const picUrl = urlMatches.find((m) => !m.includes("rsrc.php"));
    if (picUrl) {
      const cleanUrl = picUrl.replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
      return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.replace(/^@/, "").trim().toLowerCase();

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  // 1. Direct hit from pre-cached CDN cache (instant, 100% uptime)
  if (KNOWN_AVATARS[username]) {
    return NextResponse.redirect(KNOWN_AVATARS[username], {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  try {
    let profilePicUrl: string | null = null;

    // 2. Fetch live Instagram CDN URL using mobile / bot headers
    const uas = [
      "WhatsApp/2.21.12.21 A",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "TelegramBot (like TwitterBot)",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ];

    for (const ua of uas) {
      try {
        const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
          headers: {
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const html = await res.text();
          profilePicUrl = extractCdnUrl(html);
          if (profilePicUrl) break;
        }
      } catch {
        // try next UA
      }
    }

    // 3. Fallback: try unavatar.io
    if (!profilePicUrl) {
      profilePicUrl = `https://unavatar.io/instagram/${encodeURIComponent(username)}`;
    }

    return NextResponse.redirect(profilePicUrl, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("IG Avatar Fetch Error:", error);
    return NextResponse.redirect(
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=f97316,e11d48,8b5cf6,06b6d4,10b981&textColor=ffffff`
    );
  }
}

