"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [playAudio, setPlayAudio] = useState<string | null>(null);
  const [playVideo, setPlayVideo] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
const [downloadMessage, setDownloadMessage] = useState("");
const downloadMedia = async (itag: string, type: "audio" | "video") => {
  try {
    setDownloading(true);
    setDownloadMessage(type === "audio" ? "🎧 Downloading audio..." : "📽️ Downloading video...");

    const res = await fetch(`/api/download/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, itag }),
    });

    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${info.title || type}.${type === "audio" ? "mp3" : "mp4"}`;
    a.click();

    setDownloadMessage("✅ Download complete!");
  } catch (err) {
    console.error("Download error:", err);
    setDownloadMessage("❌ Failed to download");
  } finally {
    setDownloading(false);
    setTimeout(() => setDownloadMessage(""), 4000);
  }
};



  const fetchInfo = async () => {
    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Separate audio & video formats here
      const audioFormats = data.formats?.filter((f: any) =>
        f.mimeType?.includes("audio/")
      ) || [];
      const videoFormats = data.formats?.filter((f: any) =>
        f.mimeType?.includes("video/")
      ) || [];

      setInfo({
        title: data.title,
        thumbnail: data.thumbnails?.[data.thumbnails.length - 1]?.url || "",
        audioFormats,
        videoFormats,
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/70 border-b border-cyan-400 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_#00fff2]">
          ⚡ YMusic Gaming Edition
        </h1>
        <div className="flex gap-6 items-center">
          <Link
            href="https://github.com/rahulpatle-sol"
            target="_blank"
            className="flex items-center gap-2 text-pink-400 hover:text-cyan-300 transition"
          >
            <Github className="w-5 h-5" />
            GitHub
          </Link>
          <Link
            href="https://github.com/rahulpatle-sol/ytduck2.0.git"
            target="_blank"
            className="text-yellow-300 hover:text-cyan-300 transition"
          >
            Source Code
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center mt-12 px-4">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_20px_#00fff2] animate-pulse font-['Protest_Guerrilla']">
          🦆 YT DUCK <span>2.0</span>
        </h1>
        <p className="mt-4 text-pink-400 text-lg drop-shadow-[0_0_10px_#ff00ff]">
          🚀 Stream & Download in Arcade Gaming Style
        </p>

        {/* Input */}
        <div className="mt-8 flex w-full max-w-2xl border-4 border-pink-500 shadow-[4px_4px_0px_#ff00ff] rounded-xl overflow-hidden">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="🎮 Enter YouTube URL..."
            className="flex-1 px-4 py-3 bg-black text-green-400 outline-none text-sm tracking-widest placeholder-pink-600"
          />
          <button
            onClick={fetchInfo}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-black font-bold hover:scale-110 transition-transform shadow-[4px_4px_0px_#00fff2]"
          >
            🎯 Get Formats
          </button>
        </div>
      </section>

      {/* Results */}
      {info && (
        <div className="mt-12 bg-black/80 border-4 border-cyan-400 p-6 rounded-2xl shadow-[8px_8px_0px_#00fff2] w-full max-w-6xl mx-auto backdrop-blur-md">
          <h2 className="text-2xl font-bold text-yellow-300 text-center drop-shadow-[0_0_15px_#ffff00]">
            {info.title}
          </h2>
          {info.thumbnail && (
            <img
              src={info.thumbnail}
              alt="thumbnail"
              className="mt-5 w-80 rounded-xl shadow-[0_0_20px_#ff00ff] mx-auto"
            />
          )}

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Video Section */}
            <div className="bg-gradient-to-br from-purple-900/80 to-purple-700/30 p-6 rounded-xl shadow-[6px_6px_0px_#9333ea] border-2 border-purple-400">
              <h3 className="text-lg font-bold text-cyan-300 mb-5 text-center drop-shadow-[0_0_5px_#00fff2]">
                🎬 Video Formats (144p → 4K)
              </h3>
              <div className="flex flex-col gap-3">
                {info.videoFormats?.length > 0 ? (
                  info.videoFormats.map((v: any, idx: number) => (
                    <div key={v.itag || idx} className="flex gap-2">
                   <button
  onClick={() => downloadMedia(v.itag, "video")}
  className="flex-1 px-3 py-2 rounded bg-purple-700 hover:bg-purple-500 text-white font-semibold shadow-md text-center"
>
  ⬇️ {v.qualityLabel || "Unknown"} ({v.container || "mp4"})
</button>

                      <button
                        onClick={() => setPlayVideo(v.url)}
                        className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 rounded font-semibold"
                      >
                        ▶️ Play
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No video formats found</p>
                )}
              </div>
              {playVideo && (
                <video
                  src={playVideo}
                  controls
                  autoPlay
                  className="mt-4 w-full rounded-lg border-2 border-cyan-400 shadow-[0_0_20px_#00fff2]"
                />
              )}
            </div>


            {/* Audio Section */}
            <div className="bg-gradient-to-br from-cyan-900/80 to-cyan-700/30 p-6 rounded-xl shadow-[6px_6px_0px_#22c55e] border-2 border-green-400">
              <h3 className="text-lg font-bold text-pink-300 mb-5 text-center drop-shadow-[0_0_5px_#ff00ff]">
                🎵 Audio Formats (upto 320 kbps)
              </h3>
              <div className="flex flex-col gap-3">
                {info.audioFormats?.length > 0 ? (
                  info.audioFormats.map((a: any, idx: number) => (
                    <div key={a.itag || idx} className="flex gap-2">
                  <button
  onClick={() => downloadMedia(a.itag, "audio")}
  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-yellow-500 hover:scale-110 transition font-semibold shadow-[4px_4px_0px_#22c55e] text-center"
>
  ⬇️ {a.audioCodec || "Audio"} ({a.bitrate || "N/A"} kbps)
</button>

                      <button
                        onClick={() => setPlayAudio(a.url)}
                        className="px-3 py-2 bg-pink-500 hover:bg-pink-400 rounded font-semibold"
                      >
                        ▶️ Play
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No audio formats found</p>
                )}
              </div>
              {playAudio && (
                <audio
                  src={playAudio}
                  controls
                  autoPlay
                  className="mt-4 w-full border-2 border-green-400 shadow-[0_0_20px_#22c55e] rounded-lg"
                />
              )}
            </div>
          </div>
          {downloading && (
  <p className="mt-6 text-center text-cyan-300 animate-pulse font-bold text-lg">
    {downloadMessage}
  </p>
)}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 bg-black/70 border-t border-cyan-400">
        ⚡ Built with ❤️ for Gamers |{" "}
        <Link
          href="https://github.com/rahulpatle-sol"
          target="_blank"
          className="text-pink-400 hover:text-cyan-300"
        >
          GitHub
        </Link>{" "}
        |{" "}
        <Link
          href="https://github.com/rahulpatle-sol/ytduck2.0.git"
          target="_blank"
          className="text-yellow-300 hover:text-cyan-300"
        >
          Source Code
        </Link>
      </footer>
    </main>
  );
}
