"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/cerita/cerita-01-makassar.jpg";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      return fallbackSrc;
    }
    return src;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Extra safety check for valid src format
  const isValidSrc =
    typeof imgSrc === "string" &&
    (imgSrc.startsWith("/") || imgSrc.startsWith("http://") || imgSrc.startsWith("https://") || imgSrc.startsWith("data:"));

  if (!isValidSrc) {
    return (
      <Image
        {...props}
        src={fallbackSrc}
        alt={alt || "Gambar Berita"}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Gambar Berita"}
      onError={handleError}
      className={className}
      unoptimized
    />
  );
}
