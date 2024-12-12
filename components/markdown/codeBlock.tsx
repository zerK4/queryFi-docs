"use client";

import React, { ComponentProps, ReactNode } from "react";
import Copy from "./copy";
import { LucideIcon } from "lucide-react";

interface CodeBlockProps extends ComponentProps<"pre"> {
  children: ReactNode;
  raw?: string;
  title?: string;
  Icon?: LucideIcon;
}

export default function CodeBlock({ children, raw, title }: CodeBlockProps) {
  return (
    <div className='rounded-lg border dark:border-neutral-800 border-neutral-200 overflow-hidden'>
      {title && (
        <div className='flex items-center px-4 py-2 h-fit justify-between bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-800 border-neutral-200'>
          <div className='flex items-center gap-2'>
            {title ? (
              <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                {title}
              </span>
            ) : (
              <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                {/* {capitalizeFirstLetter( ?? "")} */}
              </span>
            )}
          </div>
          <div className='sm:block hidden'>
            <Copy content={raw ?? ""} />
          </div>
        </div>
      )}
      {!title ? (
        <div className='absolute right-2 top-2 my-auth h-full'>
          <Copy content={raw ?? ""} />
        </div>
      ) : null}

      {children}
    </div>
  );
}
