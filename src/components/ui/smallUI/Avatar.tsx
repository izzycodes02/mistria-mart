"use client";

import { useState } from "react";
import { IconUser } from "@tabler/icons-react";

type AvatarProps = {
  alt?: string;
  className?: string;
};

export default function Avatar({
  alt = "User profile picture",
  className = "",
}: AvatarProps) {
  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 56,
    xl: 64,
  };
  const src =
    "https://i.pinimg.com/736x/ed/f6/16/edf6162f41aa68b7c40c0291bdcf10c8.jpg";
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-creame-50 bg-gray-100 shadow-md shadow-zinc-200 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 ${className}`}
    >
      {/* Skeleton shimmer while loading */}
      {isLoading && !hasError && (
        <div
          className="absolute inset-0 animate-pulse bg-gray-200"
          aria-label="Loading profile image"
          aria-live="polite"
        />
      )}

      {/* Show Tabler icon when error or no image */}
      {(!src || hasError) && (
        <div className="relative z-10" aria-label="Default user avatar">
          <IconUser
            size={64}
            stroke={1.5}
            className="text-gray-400"
            aria-hidden="true"
            focusable="false"
          />
        </div>
      )}

      {/* Actual image */}
      {src && !hasError && (
        <img
          src={src}
          alt="User profile picture"
          className="h-full w-full object-cover object-center"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          aria-hidden={isLoading || hasError}
        />
      )}
    </div>
  );
}
