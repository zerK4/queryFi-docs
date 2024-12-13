"use client";

import React, { ComponentProps, ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Copy from "./copy";
import { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps extends ComponentProps<"pre"> {
  children: ReactNode;
  raw?: string;
  title?: string;
  Icon?: LucideIcon;
  language?: string;
}

export default function CodeBlock({
  children,
  raw,
  title,
  language = "typescript",
}: CodeBlockProps) {
  const { systemTheme, theme } = useTheme();
  const extractCodeAndLanguage = () => {
    if (React.isValidElement(children) && children.type === "pre") {
      const codeElement: any = React.Children.only(children.props.children);

      if (React.isValidElement(codeElement) && codeElement.type === "code") {
        const className = (codeElement.props as any).className || "";
        const languageMatch = className.match(/language-(\w+)/);
        const extractedLanguage = languageMatch ? languageMatch[1] : language;
        const code = (codeElement.props as any).children;

        return { code, language: extractedLanguage };
      }
    }

    return {
      code: raw || (typeof children === "string" ? children : ""),
      language,
    };
  };

  const { code, language: detectedLanguage } = extractCodeAndLanguage();

  return (
    <div className='relative my-4 dark:bg-[#0b0e14] w-full bg-neutral-50 rounded-lg border dark:border-neutral-800 border-neutral-200 overflow-hidden'>
      {title && (
        <div className='flex items-center px-4 py-2 h-fit justify-between bg-neutral-50 dark:bg-[#0b0e14] border-b dark:border-neutral-800 border-neutral-200'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              {title}
            </span>
          </div>
          <div className='sm:block hidden'>
            <Copy content={raw ?? (children as string)} />
          </div>
        </div>
      )}
      {!title && (
        <div className='absolute right-2 top-2 z-10'>
          <Copy content={raw ?? (children as string)} />
        </div>
      )}
      <div className='px-4'>
        <SyntaxHighlighter
          language={detectedLanguage}
          style={
            theme === "dark" || systemTheme === "dark" ? oneDark : oneLight
          }
          customStyle={{
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            borderRadius: 0,
            border: "none",
          }}
          codeTagProps={{
            className: "text-sm",
          }}
          wrapLines={true}
          wrapLongLines={true}
          className='overflow-x-auto'
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}