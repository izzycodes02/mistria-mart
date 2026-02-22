import Link from "next/link";
import { MouseEventHandler } from "react";

interface PublicLinkButtonProps {
  text: string;
  href?: string;
  invert: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  isDisabled?: boolean;
  isDisabledText?: string;
}

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "text-sm py-2 px-4 h-[34px] rounded-lg",
  md: "w-fit text-base py-2 px-2 rounded-lg",
  lg: "text-base md:text-lg lg:text-base py-3 px-6 rounded-xl shadow-md w-full md:w-fit",
};

export default function PublicLinkButton({
  text,
  href,
  size = "lg",
  className = "",
  invert,
  onClick,
  target,
  rel,
  isDisabled,
  isDisabledText,
}: PublicLinkButtonProps) {
  const commonClasses = `flex w-fit items-center justify-center font-semibold transition duration-300 ${
    invert
      ? "bg-white text-bb-green hover:bg-bb-green-trans"
      : "bg-bb-green text-white hover:bg-bb-green-darker"
  } ${sizeClasses[size]} ${className}`;

  // Use a variable to hold the rendered button content
  let buttonContent;

  if (href) {
    // If href exists, render a Next.js Link component
    buttonContent = (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`inline-flex ${commonClasses}`}
      >
        {text}
      </Link>
    );
  } else {
    buttonContent = (
      <button
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled ? true : undefined}
        className={`${commonClasses} ${
          isDisabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={onClick}
      >
        <span>{text}</span>
      </button>
    );
  }

  // Handle the tooltip for disabled state
  if (isDisabled && isDisabledText) {
    return (
      <div className="group relative inline-block w-full md:w-fit">
        {/* Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 translate-y-[-8px] whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1 text-xs text-white opacity-0 shadow-lg transition duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:text-sm"
        >
          {isDisabledText}
        </div>
        {buttonContent}
      </div>
    );
  }

  return buttonContent;
}
