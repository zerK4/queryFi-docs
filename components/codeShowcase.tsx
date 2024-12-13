"use client";

import { runQueryAction } from "@/actions/runQuery";
import CodeBlock from "@/components/markdown/codeBlock";
import { Button } from "@/components/ui/button";
import { defaultSetup } from "@/lib/configureMonaco";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import anime from "animejs";

export default function CodeShowcase() {
  const [data, setData] = useState<any>(null);
  const [typedData, setTypedData] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const textRef = useRef<HTMLDivElement>(null); // Ref for the "Fetch some data" text

  const runAction = async (type: "first" | "get") => {
    setLoading(true); // Show loader
    if (isTyping) {
      setTypedData(JSON.stringify(data, null, 2));
      setIsTyping(false);
      setLoading(false); // Hide loader
      return;
    }

    // Reset states
    setData(null);
    setTypedData("");
    setIsTyping(true);

    try {
      // animateCodeBlockCollapse();
      const fetchedData = await runQueryAction(type);

      if (fetchedData) {
        setData(fetchedData);
        blockTypeData(JSON.stringify(fetchedData, null, 2));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsTyping(false);
    } finally {
      setLoading(false); // Hide loader when done
    }
  };

  const blockTypeData = (fullText: string) => {
    const lines = fullText.split("\n");
    let currentLine = 0;

    const typeNextBlock = () => {
      if (currentLine >= lines.length) {
        setIsTyping(false);
        return;
      }

      const linesToAdd = lines.slice(
        currentLine,
        currentLine + Math.floor(Math.random() * 3) + 3
      );
      setTypedData(
        (prevData) =>
          prevData +
          linesToAdd.join("\n") +
          (currentLine + linesToAdd.length < lines.length ? "\n" : "")
      );

      currentLine += linesToAdd.length;

      setTimeout(typeNextBlock, Math.random() * 200 + 100);
    };

    typeNextBlock();
  };

  useEffect(() => {
    if (loading && textRef.current) {
      // Animate each letter with a wave effect
      const letters = textRef.current.querySelectorAll("span");
      anime({
        targets: letters,
        translateY: [0, -10, 0], // Creates a wave-like effect
        easing: "easeInOutSine",
        delay: (el, i) => i * 100, // Delay each letter
        duration: 1000,
        loop: true, // Loop animation
      });
    }
  }, [loading]);

  return (
    <div
      className={cn(
        "flex gap-4 sm:container mx-auto w-[90vw] flex-col lg:flex-row justify-center lg:justify-between lg:items-center"
      )}
    >
      <div className={cn("flex flex-col w-full gap-4 relative code-block-1")}>
        <CodeBlock raw={defaultSetup} lang='typescript' title='Typescript'>
          {defaultSetup}
        </CodeBlock>
        <div className='inline-flex absolute -bottom-0.5 right-4 -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
          <Button
            className='rounded-none shadow-none w-fit first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
            variant='outline'
            aria-label='Get Data'
            disabled={isTyping || loading} // Disable while loading
            onClick={() => runAction("get")}
          >
            Get
          </Button>
          <Button
            className='rounded-none shadow-none w-fit first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
            variant='outline'
            aria-label='Get First'
            disabled={isTyping || loading} // Disable while loading
            onClick={() => runAction("first")}
          >
            First
          </Button>
        </div>
      </div>
      {loading ? (
        <div className='flex items-center justify-center min-w-28'>
          <div ref={textRef} className='loader' />
        </div>
      ) : data ? (
        <div className='flex rounded-lg response-block'>
          <CodeBlock
            raw={isTyping ? typedData : JSON.stringify(data, null, 2)}
            title='Response'
          >
            {isTyping
              ? typedData
              : data
              ? JSON.stringify(data, null, 2)
              : "No data"}
          </CodeBlock>
        </div>
      ) : (
        <p>Fetch some data.</p>
      )}
    </div>
  );
}
