"use client";

import { useState } from "react";

import { IconPhotoExclamation } from "@tabler/icons-react";


export default function CoverImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const src =
    "https://i.pinimg.com/1200x/f6/f3/36/f6f336624841826a2b26c6be6dd1a9c5.jpg";

  return (
    <div
      role="img"
      aria-label="Profile cover image"
      className="relative flex h-150 w-full items-center justify-center overflow-hidden rounded-b-lg border border-t-0 border-gray-200 bg-gray-300 shadow-sm shadow-zinc-200 sm:h-200 sm:rounded-b-2xl"
    >
      {isLoading && !hasError && (
        <div
          aria-label="Loading cover image"
          aria-live="polite"
          className="absolute inset-0 animate-pulse bg-neutral-200"
        />
      )}

      {/* Show Tabler icon when error or no image */}
      {(!src || hasError) && (
        <div
          className="relative z-10 text-center"
          aria-label="Default cover image placeholder"
        >
          <IconPhotoExclamation
            size={64}
            stroke={1.25}
            className="text-zinc-400"
            aria-hidden="true"
            focusable="false"
          />
        </div>
      )}

      {src && !hasError && (
        <img
          src={src}
          alt="User profile cover image"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="h-full w-full object-cover object-center"
          aria-hidden={isLoading || hasError}
        />
      )}
    </div>
  );
}
