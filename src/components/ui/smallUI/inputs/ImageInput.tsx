"use client";

import { useRef, useState, useEffect } from "react";
import {
  IconExclamationCircle,
  IconPhotoPlus,
  IconX,
} from "@tabler/icons-react";

type ImageInputProps = {
  label?: string;
  value?: File | null;
  defaultImage?: string;
  onImageChange?: (file: File | null) => void;
  onError?: (error: string | null) => void;
  error?: string | null;
};

export function ValidationBox({
  message,
  id,
}: {
  message: string | null;
  id?: string;
}) {
  if (!message) return null;
  return (
    <section
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="validationBox normal modal mt-1 text-sm text-red-600"
    >
      <p className="flex items-center gap-1">
        <span aria-hidden="true">
          <IconExclamationCircle size={18} stroke={1.75} />
        </span>
        <span className="mt-[2px]">{message}</span>
      </p>
    </section>
  );
}

export default function ImageInput({
  label,
  value,
  defaultImage,
  onImageChange,
  error,
  onError,
}: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

  const errorId = `cover-image-error`;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "Image must be smaller than 3MB";
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return "Please select a JPG, PNG, or WebP image";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validationError = validateFile(selectedFile);

      if (validationError) {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
        onImageChange?.(null);
        onError?.(validationError);

        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target?.result as string);
      reader.readAsDataURL(selectedFile);
      onImageChange?.(selectedFile);
      onError?.(null);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onImageChange?.(null);
    onError?.(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    if (value instanceof File) {
      const validationError = validateFile(value);
      if (validationError) {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
        onImageChange?.(null);
        onError?.(validationError);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target?.result as string);
        reader.readAsDataURL(value);
        onError?.(null);
      }
    } else if (!value) {
      setPreview(defaultImage || null);
    }
  }, [value, defaultImage]);

  return (
    <div className={`flex flex-col gap-2 ${error ? "justify-center items-center w-full" : ""}`}>
      {label && (
        <label
          htmlFor={
            label
              ? `image-input-${label.replace(/\s+/g, "-").toLowerCase()}`
              : undefined
          }
          className="sr-only text-sm font-medium"
        >
          {label}
        </label>
      )}

      <div
        role="button"
        aria-label={preview ? "Change image" : "Add image"}
        className={`relative aspect-[2/3] w-150 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] sm:w-[175px] lg:w-[180px] ${
          preview
            ? "cursor-pointer border border-bb-border-1 shadow-md"
            : "flex flex-col items-center justify-center border-[1.75px] border-dashed border-bb-border-1 bg-bb-surface"
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label ? `${label} preview` : "Selected image preview"}
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-md border border-red-400 bg-red-50 p-1 text-red-400 shadow-sm hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={handleRemoveImage}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <IconX size={14} aria-hidden="true" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-3 text-center text-sm">
            <div
              className="w-fit rounded-lg border border-bb-border-1 bg-white p-1.5 text-zinc-500"
              aria-hidden="true"
            >
              <IconPhotoPlus size={22} stroke={1.5} aria-hidden="true" />
            </div>
            <div className="text-zinc-500">
              <p className="mb-1">Choose an image</p>
              <p className="text-xs">JPG or PNG, max 3 MB</p>
            </div>
            <div
              className="rounded-lg border border-bb-border-1 bg-white px-4 py-1 font-semibold text-inherit shadow-sm hover:bg-zinc-75"
              aria-hidden="true"
            >
              Add Image
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg, image/png, image/webp, image/jpg"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          aria-label={label || "Image upload"}
          id={
            label
              ? `image-input-${label.replace(/\s+/g, "-").toLowerCase()}`
              : undefined
          }
        />
      </div>
      <ValidationBox message={error ?? null} id={errorId} />
    </div>
  );
}
