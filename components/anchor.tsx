"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean;
  activeClassName?: string;
  disabled?: boolean;
};

export default function Anchor({
  absolute,
  className = "",
  activeClassName = "",
  disabled,
  children,
  ...props
}: AnchorProps) {
  const path = usePathname();
  let isMatch = absolute
    ? props.href.toString().split("/")[1] == path.split("/")[1]
    : path === props.href;

  if (props.href.toString().includes("http")) isMatch = false;

  if (disabled)
    return (
      <div
        className={cn(className, "cursor-not-allowed flex items-center gap-2")}
      >
        {children}
      </div>
    );
  return (
    <Link
      className={cn(
        className,
        isMatch && activeClassName,
        "flex items-center gap-2"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
