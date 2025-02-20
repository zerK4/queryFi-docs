"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Tooltip open={isCopied} delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant='outline' size='xs' onClick={handleCopy}>
          {!isCopied ? (
            <CopyIcon className='w-3 h-3' />
          ) : (
            <CheckIcon className='w-3 h-3' />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copied</TooltipContent>
    </Tooltip>
  );
}
