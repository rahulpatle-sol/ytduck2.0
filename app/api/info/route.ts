import ytdl from "@distube/ytdl-core";
import { HttpsProxyAgent } from "https-proxy-agent";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Proxy agent
    const proxyAgent = new HttpsProxyAgent("http://your-proxy-ip:port");

    // ytdl options (use dispatcher instead of agent)
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        dispatcher: proxyAgent, // ✅ FIX
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
      },
    });

    return Response.json({ info });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to fetch video info" },
      { status: 500 }
    );
  }
}
