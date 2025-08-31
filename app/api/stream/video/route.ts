import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(req: Request) {
  try {
    const { url, itag } = await req.json();

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const stream = ytdl(url, {
      quality: itag || "highestvideo",
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    });

    // Return a Response with stream
    return new Response(stream as any, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline",
      },
    });
  } catch (error: any) {
    console.error("Stream Video Error:", error);
    return NextResponse.json({ error: "Failed to stream video" }, { status: 500 });
  }
}
