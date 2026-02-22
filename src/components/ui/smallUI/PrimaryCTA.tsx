import Link from "next/link";
import * as TablerIcons from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import React from "react";

type Props = {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  isFixedFab?: boolean;
  icon?:
    | keyof typeof TablerIcons
    | React.ComponentType<IconProps>
    | React.ReactNode;
  variant?: "auto" | "fab" | "default";
};

export default function PrimaryCTA({
  text,
  href,
  onClick,
  className,
  variant = "auto",
  isFixedFab = true,
  icon,
}: Props) {
  const baseStyles = "primaryCTA ";

  const fabShapeStyles =
    "z-[20] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[var(--primary)] text-white border border-[var(--primary-border)] shadow-md active:scale-[0.97] hover:bg-[var(--primary-darker)] duration-150 ease-in lg:hidden";

  const fabPositionStyles =
    "fixed bottom-20 right-5 sm:bottom-16 sm:right-10 ";

  const fabStyles = `${isFixedFab ? fabPositionStyles : ""} ${fabShapeStyles}`;

  const normalStyles = "hidden lg:inline-flex w-full gap-2";

  const combinedClass =
    variant === "fab"
      ? fabStyles
      : variant === "default"
        ? `${baseStyles} ${normalStyles}`
        : `${fabStyles} ${baseStyles} ${normalStyles}`;

  const iconClass =
    "w-6 h-6 lg:w-5 lg:w-5 stroke-[1.75] icon-shadow";

    const renderIcon = () => {
      if (!icon) return null;

      if (React.isValidElement(icon)) {
        return <span className={iconClass}>{icon}</span>;
      }

      if (typeof icon === "string") {
        const IconComponent = TablerIcons[
          icon as keyof typeof TablerIcons
        ] as React.ComponentType<IconProps>;

        if (IconComponent) {
          return <IconComponent className={iconClass} />;
        }
        return null;
      }
      if (typeof icon === "function") {
        const IconComponent = icon as React.ComponentType<IconProps>;
        return <IconComponent className={iconClass} />;
      }

      return null;
    };

    const content = (
      <>
        {renderIcon()}
        {/* hide text for fab version visually but keep for screen readers */}
        <span className="hidden lg:inline">{text}</span>
        {/* Screen reader only text for FAB */}
        {variant === "fab" || variant === "auto" ? (
          <span className="sr-only">{text}</span>
        ) : null}
      </>
    );

  if (!href && !onClick) {
    console.warn("PrimaryCTA requires either href or onClick");
  }

  if (href) {
    return (
      <Link
        href={href}
        role="button"
        aria-label={text}
        title={text}
        className={`${combinedClass} ${className || ""}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={text}
      title={text}
      onClick={onClick}
      className={`${combinedClass} ${className || ""}`}
    >
      {content}
    </button>
  );
}
