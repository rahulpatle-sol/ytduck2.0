import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { HttpsProxyAgent } from "https-proxy-agent";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });
    }

    const proxy = process.env.PROXY_URL || "";
    const proxyAgent = proxy ? new HttpsProxyAgent(proxy) : undefined;

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
        agent: proxyAgent, // optional, only if needed
      },
    });

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnails: info.videoDetails.thumbnails,
      formats: info.formats,
    });
  } catch (err: any) {
    console.error("Error fetching video info:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch video info", details: err.message },
      { status: 500 }
    );
  }
}
