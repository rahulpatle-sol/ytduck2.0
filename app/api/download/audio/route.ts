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

    const audioFormats = info.formats.filter((f) => f.mimeType?.includes("audio/"));

    return NextResponse.json({ audioFormats });
  } catch (error: any) {
    console.error("Audio Error:", error);
    return NextResponse.json({ error: "Failed to fetch audio formats" }, { status: 500 });
  }
}
