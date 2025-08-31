import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(req: Request) {
  const body = await req.json();
  const url = body.url;

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);

    // 🎬 Video + Audio (muxed)
    const videoFormats = info.formats
      .filter((f) => f.hasVideo && f.hasAudio && f.qualityLabel)
      .sort((a, b) => {
        const qa = parseInt(a.qualityLabel) || 0;
        const qb = parseInt(b.qualityLabel) || 0;
        return qb - qa;
      });

    // 🎵 Audio only
    const audioFormats = info.formats
      .filter((f) => f.hasAudio && !f.hasVideo)
      .map((f) => ({
        itag: f.itag,
        mimeType: f.mimeType,
        audioCodec: f.audioCodec,
        bitrate: f.bitrate,
        url: f.url,
        size: f.contentLength
          ? (Number(f.contentLength) / 1024 / 1024).toFixed(1) + " MB"
          : "N/A",
      }));

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.at(-1)?.url,
      videoFormats,
      audioFormats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
