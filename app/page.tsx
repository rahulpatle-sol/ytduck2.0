"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<any>(null);

  async function fetchInfo() {
    const res = await fetch("/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.error) return alert(data.error);
    setInfo(data);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex flex-col items-center p-6 font-mono">
      <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_#00fff2] animate-pulse text-center tracking-wider">
        🎮 YT Neon Downloader
      </h1>
      <p className="mt-3 text-gray-400 text-center text-lg">
        Stream & Download High-Quality YouTube Audio/Video 🚀
      </p>

      {/* Input */}
      <div className="mt-6 flex w-full max-w-xl neon-border">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube link..."
          className="flex-1 px-4 py-3 rounded-l-xl bg-black/60 border border-cyan-500 text-cyan-300 focus:outline-none backdrop-blur-lg"
        />
        <button
          onClick={fetchInfo}
          className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-r-xl hover:bg-cyan-400 transition-transform hover:scale-105"
        >
          🚀 Fetch
        </button>
      </div>

      {/* Results */}
      {info && (
        <div className="mt-10 bg-black/50 backdrop-blur-xl border border-purple-700/50 p-6 rounded-2xl shadow-[0_0_20px_#6b21a8] w-full max-w-6xl animate-fadeIn">
          <h2 className="text-2xl font-bold text-purple-300 text-center drop-shadow-[0_0_5px_#a855f7]">
            {info.title}
          </h2>
          <img
            src={info.thumbnail}
            alt="thumbnail"
            className="mt-4 w-80 rounded-xl shadow-lg mx-auto animate-glow"
          />

          {/* Grid layout */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 🎬 Video Section */}
            <div className="bg-gradient-to-br from-purple-900/60 to-purple-700/30 p-5 rounded-xl shadow-lg neon-card">
              <h3 className="text-lg font-bold text-cyan-300 mb-4 text-center">
                🎬 Video + Audio (144p → 4K)
              </h3>
              <div className="flex flex-col gap-3">
                {(info.videoFormats||[]).map((v: any) => (
                  <button
                    key={v.itag}
                    onClick={() =>
                      window.open(
                        `/api/download/video?url=${encodeURIComponent(
                          url
                        )}&itag=${v.itag}`,
                        "_blank"
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-110 transition font-semibold shadow-[0_0_10px_#9333ea]"
                  >
                    🎥 {v.quality} ({v.size})
                  </button>
                ))}

                <button
                  onClick={() =>
                    (document.getElementById(
                      "videoPlayer"
                    )!.src = `/api/stream/video?url=${encodeURIComponent(
                      url
                    )}&itag=${info.videoFormats[0].itag}`)
                  }
                  className="px-4 py-2 mt-4 bg-blue-500 rounded-lg hover:bg-blue-400 transition font-semibold shadow-[0_0_10px_#3b82f6]"
                >
                  ▶️ Play Video
                </button>
                <video
                  id="videoPlayer"
                  controls
                  className="mt-3 w-full rounded-lg shadow-xl"
                ></video>
              </div>
            </div>

            {/* 🎵 Audio Section */}
            <div className="bg-gradient-to-br from-cyan-900/60 to-cyan-700/30 p-5 rounded-xl shadow-lg neon-card">
              <h3 className="text-lg font-bold text-purple-300 mb-4 text-center">
                🎵 Audio Only (upto 320 kbps)
              </h3>
              <div className="flex flex-col gap-3">
                {info.audioFormats.map((a: any) => (
                  <button
                    key={a.itag}
                    onClick={() =>
                      window.open(
                        `/api/download/audio?url=${encodeURIComponent(
                          url
                        )}&itag=${a.itag}`,
                        "_blank"
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-110 transition font-semibold shadow-[0_0_10px_#06b6d4]"
                  >
                    🎧 {a.bitrate} ({a.size})
                  </button>
                ))}

                <button
                  onClick={() =>
                    (document.getElementById(
                      "audioPlayer"
                    )!.src = `/api/stream/audio?url=${encodeURIComponent(
                      url
                    )}&itag=${info.audioFormats[0].itag}`)
                  }
                  className="px-4 py-2 mt-4 bg-green-500 rounded-lg hover:bg-green-400 transition font-semibold shadow-[0_0_10px_#22c55e]"
                >
                  ▶️ Play Audio
                </button>
                <audio
                  id="audioPlayer"
                  controls
                  className="mt-3 w-full"
                ></audio>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
