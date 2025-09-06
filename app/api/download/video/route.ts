import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";

export async function POST(req: Request) {
  try {
    const { url, itagVideo, itagAudio } = await req.json();

    if (!url || !itagVideo || !itagAudio) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const videoStream = ytdl(url, { quality: itagVideo });
    const audioStream = ytdl(url, { quality: itagAudio });

    const ffmpeg = spawn(ffmpegPath!, [
      "-i", "pipe:3", // audio
      "-i", "pipe:4", // video
      "-c:v", "copy",
      "-c:a", "aac",
      "-f", "mp4",
      "pipe:1"
    ], {
      stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"]
    });

    audioStream.pipe(ffmpeg.stdio[3]);
    videoStream.pipe(ffmpeg.stdio[4]);

    return new Response(ffmpeg.stdout, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="merged.mp4"`
      }
    });
  } catch (err: any) {
    console.error("FFmpeg merge error:", err.message);
    return NextResponse.json({ error: "Merge failed", details: err.message }, { status: 500 });
  }
}
