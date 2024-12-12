import { useState, useCallback, useEffect, RefObject } from "react";

interface UseSearchHookProps {
  resultsLength: number;
  onSelect: (index: number) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

export function useSearch({
  resultsLength,
  onSelect,
  inputRef,
}: UseSearchHookProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ensure we're not typing in an input
      if (document.activeElement?.tagName === "INPUT") {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();

          setActiveIndex((current) => {
            if (event.key === "ArrowDown") {
              // Wrap to top if at the bottom
              return current < resultsLength - 1 ? current + 1 : 0;
            } else {
              // Wrap to bottom if at the top
              return current > 0 ? current - 1 : resultsLength - 1;
            }
          });
        } else if (event.key === "Enter" && activeIndex !== -1) {
          event.preventDefault();
          onSelect(activeIndex);
        }
      }
    },
    [resultsLength, activeIndex, onSelect]
  );

  useEffect(() => {
    // Reset active index when results change
    setActiveIndex(-1);
  }, [resultsLength]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    activeIndex,
    setActiveIndex,
  };
}
