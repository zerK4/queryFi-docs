import React from "react";
import { ComponentProps } from "react";
import Copy from "./copy";

interface CustomPreProps extends ComponentProps<"pre"> {
  children: React.ReactNode;
  className?: string;
  raw?: string;
}

export default function Pre({
  children,
  className,
  raw,
  ...rest
}: CustomPreProps) {
  const language = className?.replace(/language-/, "");

  return (
    <div className='rounded-lg border dark:border-neutral-800 border-neutral-200 overflow-hidden my-4 relative'>
      <div className='absolute right-2 top-2'>
        <Copy content={raw ?? ""} />
      </div>
      <pre
        lang={language ?? ""}
        {...rest}
        className='p-4 m-0 overflow-x-auto'
        style={{
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
