import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";
import { rateLimit } from "../../../lib/rateLimit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const itag = searchParams.get("itag");

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip)) return new Response("Rate limit exceeded", { status: 429 });

  if (!url || !ytdl.validateURL(url)) return new Response("Invalid URL", { status: 400 });

  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: itag! });

  const safeTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, "");
  const fileName = `${safeTitle}.${format.container || "mp3"}`;

  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
  headers.set("Content-Type", "audio/mpeg");

  return new Response(ytdl(url, { format }) as any, { headers });
}
