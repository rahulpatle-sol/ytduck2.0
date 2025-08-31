import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { HttpsProxyAgent } from "https-proxy-agent";

// ✅ Function to fetch free proxies dynamically
async function getProxy() {
  try {
    const res = await fetch("https://www.proxy-list.download/api/v1/get?type=http");
    const text = await res.text();
    const proxies = text.split("\r\n").filter(Boolean);

    if (proxies.length === 0) return null;

    // Random ek proxy pick karenge
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    console.log("Using proxy:", randomProxy);

    return `http://${randomProxy}`;
  } catch (err) {
    console.error("Failed to fetch proxy list:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // Proxy leke agent banao
    const proxyUrl = await getProxy();
    if (!proxyUrl) {
      return NextResponse.json({ error: "No proxy available" }, { status: 500 });
    }

    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        agent: proxyAgent,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.youtube.com/",
        },
      },
    });

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnails: info.videoDetails.thumbnails,
      formats: info.formats,
    });
  } catch (err: any) {
    console.error("Info API Error:", err);
    return NextResponse.json(
      { error: `Failed to fetch video info: ${err.message}` },
      { status: 500 }
    );
  }
}
