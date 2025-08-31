import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { rateLimit } from "../.././../lib/rateLimit";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    });

    const videoFormats = info.formats.filter((f) => f.mimeType?.includes("video/"));

    return NextResponse.json({ videoFormats });
  } catch (error: any) {
    console.error("Video Error:", error);
    return NextResponse.json({ error: "Failed to fetch video formats" }, { status: 500 });
  }
}
