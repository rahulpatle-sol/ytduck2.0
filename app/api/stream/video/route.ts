import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const itag = searchParams.get("itag");

  if (!url || !ytdl.validateURL(url)) return new Response("Invalid URL", { status: 400 });

  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: itag! });

  return new Response(ytdl(url, { format }) as any, {
    headers: { "Content-Type": "video/mp4" },
  });
}
