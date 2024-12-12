"use client";

import { CommandIcon, FileIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import Anchor from "./anchor";
import { advanceSearch, cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearch } from "@/hooks/useSearchHook";

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const filteredResults = useMemo(
    () => advanceSearch(searchedInput.trim()),
    [searchedInput]
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm) return filteredResults;

    const searchRegex = new RegExp(searchTerm.split("").join(".*"), "i");

    return filteredResults.filter((item) => {
      const nameMatch = searchRegex.test(item.title);

      return nameMatch;
    });
  }, [filteredResults, searchTerm]).filter((x) => x.title.trim());

  const handleResultSelect = (index: number) => {
    if (filteredItems[index]) {
      // Navigate to the selected item's href
      window.location.href = `/docs${filteredItems[index].href}`;
    }
  };

  const { activeIndex } = useSearch({
    resultsLength: filteredItems.length,
    onSelect: handleResultSelect,
    inputRef,
  });

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;

    const chars = searchTerm.split("");
    const highlightedParts = [];
    let lastIndex = 0;

    chars.forEach((char) => {
      const charIndex = text
        .toLowerCase()
        .indexOf(char.toLowerCase(), lastIndex);
      if (charIndex !== -1) {
        highlightedParts.push(text.slice(lastIndex, charIndex));
        highlightedParts.push(
          <span
            key={charIndex}
            className='dark:bg-orange-400 first:rounded-l-md first:pl-2 last:rounded-r-md last:pr-2'
          >
            {text.slice(charIndex, charIndex + 1)}
          </span>
        );
        lastIndex = charIndex + 1;
      }
    });

    highlightedParts.push(text.slice(lastIndex));

    return highlightedParts;
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Scroll to active item
  useEffect(() => {
    if (activeIndex !== -1 && resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setSearchedInput("");
          setIsOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div className='relative flex-1 max-w-md cursor-pointer'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 dark:text-stone-400' />
            <Input
              className='md:w-full rounded-md dark:bg-background/95 bg-background border h-9 pl-10 pr-0 sm:pr-7 text-sm shadow-sm overflow-ellipsis'
              placeholder='Search documentation...'
              type='search'
            />
            <div className='sm:flex hidden absolute top-1/2 -translate-y-1/2 right-2 text-xs font-medium font-mono items-center gap-0.5 dark:bg-stone-900 bg-stone-200/65 p-1 rounded-sm'>
              <CommandIcon className='w-3 h-3' />
              <span>k</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className='p-0 max-w-[650px] sm:top-[38%] top-[45%] !rounded-md bg-accent border-primary/10 shadow-md shahdow-primary-20'>
          <DialogTitle className='sr-only'>Search</DialogTitle>
          <DialogHeader>
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Type something to search...'
              autoFocus
              className='h-14 px-6 bg-transparent border-b text-[14px] outline-none'
            />
          </DialogHeader>
          {filteredItems.length == 0 && searchedInput && (
            <p className='text-muted-foreground mx-auto mt-2 text-sm'>
              No results found for{" "}
              <span className='text-primary'>{`"${searchedInput}"`}</span>
            </p>
          )}
          <ScrollArea className='max-h-[400px] overflow-y-auto'>
            <div
              ref={resultsContainerRef}
              className='flex flex-col items-start overflow-y-auto sm:px-2 px-1 pb-4'
            >
              {filteredItems.map((item, index) => {
                const level = (item.href.split("/").slice(1).length -
                  1) as keyof typeof paddingMap;
                const paddingClass = paddingMap[level];

                return (
                  <DialogClose key={item.href} asChild>
                    <Anchor
                      className={cn(
                        "dark:hover:bg-neutral-800 ease-linear duration-150 hover:bg-neutral-200 w-full px-3 rounded-sm text-sm flex items-center gap-2.5",
                        paddingClass,
                        index === activeIndex &&
                          "bg-neutral-200 dark:bg-neutral-800"
                      )}
                      href={`/docs${item.href}`}
                    >
                      <div
                        className={cn(
                          "flex items-center w-fit h-full gap-1.5 py-3 px-2",
                          level > 1 && "border-l pl-4"
                        )}
                      >
                        {item.icon ?? <FileIcon size={16} />}
                        <div>{highlightMatch(item.title)}</div>
                      </div>
                    </Anchor>
                  </DialogClose>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const paddingMap = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-10",
  // Add more levels if needed
} as const;
