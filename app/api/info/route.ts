import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);

    // 🎵 Audio only (up to 320 kbps)
    const audioFormats = info.formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))
      .map(f => ({
        itag: f.itag,
        bitrate: `${f.audioBitrate} kbps`,
        size: f.contentLength
          ? `${(Number(f.contentLength) / 1024 / 1024).toFixed(2)} MB`
          : "Unknown",
        mimeType: f.mimeType,
      }));

    // 📹 Video only (144p → 4K)  [No audio inside!]
    const videoOnlyFormats = info.formats
      .filter(f => f.hasVideo && !f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel,
        fps: f.fps,
        size: f.contentLength
          ? `${(Number(f.contentLength) / (1024 * 1024)).toFixed(2)} MB`
          : "Unknown",
        mimeType: f.mimeType,
      }));

    // 🎬 Progressive (video+audio) → max 720p
    const muxedFormats = info.formats
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel,
        size: f.contentLength
          ? `${(Number(f.contentLength) / (1024 * 1024)).toFixed(2)} MB`
          : "Unknown",
        mimeType: f.mimeType,
      }));

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop()?.url,
      audioFormats,       // up to 320 kbps
      videoOnlyFormats,   // 144p → 4K (no audio)
      muxedFormats        // video+audio (360p/720p max)
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
