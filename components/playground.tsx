"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { cn } from "@/lib/utils";
import Copy from "./markdown/copy";

function Playground({
  children,
  file,
  title,
}: {
  children: string;
  file?: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const width = "100%"; // Set the width of the editor
  const monacoEditor = useRef<editor.IStandaloneCodeEditor>();

  // Typing the editor argument as MonacoEditor
  const handleContentSizeChange = (editor?: editor.IStandaloneCodeEditor) => {
    if (!editor) return;

    const contentHeight = Math.min(1000, editor.getContentHeight());
    setEditorHeight(contentHeight);
    if (containerRef.current) {
      containerRef.current.style.height = `${contentHeight}px`;
    }
  };

  useEffect(() => {
    if (monacoEditor.current) {
      handleContentSizeChange(monacoEditor.current);
    }

    return () => {
      // Cleanup if necessary
    };
  }, [editorHeight]);

  useEffect(() => {
    if (!monacoEditor.current) return;

    monacoEditor.current.onDidContentSizeChange(() =>
      handleContentSizeChange(monacoEditor.current)
    );
  }, [monacoEditor]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full bg-[#0b0e14] rounded-lg overflow-hidden border-2 border-neutral-900"
      )}
      style={{ width: `${width}px`, height: `${editorHeight}px` }}
    >
      {file || title ? (
        <div className='border-b flex justify-between items-center p-2 px-4 text-sm font-medium'>
          <span>
            {title && title}
            {file && ` | ${file}`}
          </span>
          <Copy content={children} />
        </div>
      ) : null}
      <Editor
        theme='vs-dark'
        defaultLanguage='typescript'
        onMount={(editor) => {
          monacoEditor.current = editor;
          // Set initial content and handle size adjustment
          editor.setValue(children ?? "");
          handleContentSizeChange(editor);
        }}
        height='inherit' // Set height to inherit from parent
        options={{
          readOnly: true,
          automaticLayout: true,
          wordWrap: "on",
          wrappingStrategy: "advanced",
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          scrollBeyondLastLine: false,
          fontFamily: "CaskaydiaMono Nerd Font",
          lineHeight: 30,
          minimap: {
            enabled: false,
          },
          lineNumbers: "on",
          renderLineHighlight: "none",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          suggest: {
            showMethods: true,
            showFunctions: true,
            showConstants: true,
            showVariables: true,
            showClasses: true,
            showKeywords: true,
            showSnippets: true,
            showColors: true,
            showReferences: true,
          },
        }}
      />
    </div>
  );
}

export default Playground;
