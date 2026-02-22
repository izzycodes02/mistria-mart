import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type DirectionalNavButtonProps = {
  direction: "left" | "right";
  onClick?: () => void;
  label?: string;
};

export default function DirectionalNavButton(props: DirectionalNavButtonProps) {
  return (
    <button type="button" className="dnbutton" onClick={props.onClick}>
      {props.direction === "left" && <IconChevronLeft />}
      <span>{props.label}</span>
      {props.direction === "right" && <IconChevronRight />}
    </button>
  );
}
