"use client";

import { useState } from "react";

export default function GifBadges() {
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());

  const badgeList = [
    "https://64.media.tumblr.com/bb1299e0ae4a928ec4856adedeec52af/b3ae6884757269ec-2f/s75x75_c1/b0a270ab92da8e927ab2007c5f5e0d49d5267eb6.gifv",
    "https://64.media.tumblr.com/e93d2e996b768ded5a03cd9971258051/0f1dd797b5574c42-48/s75x75_c1/9612acd993be4ee33f2acb225e6d4afac79292a3.gifv",
    "https://64.media.tumblr.com/bc0bc44174362eb81d87bb2870f893c7/e7d74065fc3a0376-08/s75x75_c1/4abc4b27f80a26ded74ed9809519c0115a8c887c.gifv",
  ];

  if (!badgeList || badgeList.length === 0) {
    return null;
  }

  return (
    <div
      role="list"
      aria-label="User badges"
      className="flex items-center gap-[6px]"
    >
      {badgeList.map((badge, idx) => (
        <div
          key={idx}
          role="listitem"
          className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-zinc-200 bg-white p-[6px] shadow-sm transition duration-150 ease-out hover:scale-[1.10] sm:bg-white/80"
        >
          <img
            src={badge}
            loading="lazy"
            decoding="async"
            alt={`Badge ${idx + 1}`}
            onError={() => {
              setErrorIndices((prev) => new Set(prev).add(idx));
            }}
            style={{
              display: errorIndices.has(idx) ? "none" : "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}
