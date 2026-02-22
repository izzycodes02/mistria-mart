import { IconProps } from "@tabler/icons-react";
import Link from "next/link";
import * as TablerIcons from "@tabler/icons-react";
import React from "react";

type Props = {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  title?: string;
  type: "primary" | "secondary" | "inverted";
  icon?:
    | keyof typeof TablerIcons
    | React.ComponentType<IconProps>
    | React.ReactNode;
};

export default function Button({
  label,
  onClick,
  href,
  className,
  icon,
  type,
  title
}: Props) {
  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return <span>{icon}</span>;
    }

    if (typeof icon === "string") {
      const IconComponent = TablerIcons[
        icon as keyof typeof TablerIcons
      ] as React.ComponentType<IconProps>;

      if (IconComponent) {
        return <IconComponent />;
      }
      return null;
    }
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<IconProps>;
      return <IconComponent />;
    }

    return null;
  };
  let buttonContent;

  if (href) {
    buttonContent = (
      <Link
        href={href}
        target="_blank"
        title={title}
        rel="noopener noreferrer"
        className={`bb-button ${type === "primary" && "primary"} ${type === "secondary" && "secondary"} ${className}`}
      >
        {renderIcon()}
        {label}
      </Link>
    );
  } else {
    buttonContent = (
      <button
        type="button"
        title={title}
        className={`bb-button ${type === "primary" && "primary"} ${type === "secondary" && "secondary"} ${className}`}
        onClick={onClick}
      >
        {renderIcon()}
        {label}
      </button>
    );
  }
  return buttonContent;
}
