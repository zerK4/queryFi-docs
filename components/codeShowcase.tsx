"use client";

import { runQueryAction } from "@/actions/runQuery";
import CodeBlock from "@/components/markdown/codeBlock";
import { Button } from "@/components/ui/button";
import { defaultSetup } from "@/lib/configureMonaco";
import { cn } from "@/lib/utils";
import { useState } from "react";
import anime from "animejs";

export default function CodeShowcase() {
  const [data, setData] = useState<any>(null);
  const [typedData, setTypedData] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const runAction = async (type: "first" | "get") => {
    if (isTyping) {
      setTypedData(JSON.stringify(data, null, 2));
      setIsTyping(false);
      return;
    }

    // Reset states
    setData(null);
    setTypedData("");
    setIsTyping(true);

    try {
      animateCodeBlockCollapse();
      const fetchedData = await runQueryAction(type);

      if (fetchedData) {
        setData(fetchedData);
        animateResponseBlock();
        blockTypeData(JSON.stringify(fetchedData, null, 2));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsTyping(false);
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

  const animateCodeBlockCollapse = () => {
    anime({
      targets: ".code-block-1",
      width: ["100%", "100%"],
      duration: 1500,
      easing: "easeInOutExpo",
    });
  };

  const animateResponseBlock = () => {
    anime({
      targets: ".response-block",
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1200,
      easing: "easeOutExpo",
      delay: 3000,
    });
  };

  return (
    <div
      className={cn(
        "flex gap-4 sm:container mx-auto w-[90vw] flex-col lg:flex-row justify-center lg:justify-between lg:items-center",
        !data && "lg:flex-col"
      )}
    >
      <div className={cn("flex flex-col w-full gap-4 relative code-block-1")}>
        <CodeBlock raw={defaultSetup} lang='typescript' title='Typescript'>
          {defaultSetup}
        </CodeBlock>
        <div className='inline-flex absolute -bottom-0.5 right-4 -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
          <Button
            className='w-fit rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
            variant='outline'
            aria-label='Get Data'
            disabled={isTyping}
            onClick={() => runAction("get")}
          >
            Get
          </Button>
          <Button
            className='w-fit rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
            variant='outline'
            aria-label='Get First'
            disabled={isTyping}
            onClick={() => runAction("first")}
          >
            First
          </Button>
        </div>
      </div>
      {data ? (
        <div className='response-block flex rounded-lg'>
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
