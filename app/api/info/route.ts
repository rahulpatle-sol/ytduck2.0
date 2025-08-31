import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    });

    return NextResponse.json({
      title: info.videoDetails.title,
      lengthSeconds: info.videoDetails.lengthSeconds,
      thumbnails: info.videoDetails.thumbnails,
      formats: info.formats,
    });
  } catch (error: any) {
    console.error("Info Error:", error);
    return NextResponse.json({ error: "Failed to fetch video info" }, { status: 500 });
  }
}
