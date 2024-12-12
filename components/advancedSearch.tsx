import React, { useState, useMemo, useRef } from "react";
import { Input } from "./ui/input";

export type SearchableItem<T> = {
  id: T;
  name: string;
  keywords?: string[];
};

interface SearchableDropdownProps<T> {
  items: SearchableItem<T>[];
  onSelect?: (item: SearchableItem<T>) => void;
  placeholder?: string;
  emptyStateMessage?: string;
}

export default function SearchableDropdown<T>({
  items,
  onSelect,
  placeholder = "Select an item",
  emptyStateMessage = "No results found",
}: SearchableDropdownProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const searchRegex = new RegExp(searchTerm.split("").join(".*"), "i");

    return items.filter((item) => {
      const nameMatch = searchRegex.test(item.name);
      const keywordMatch = item.keywords?.some((keyword) =>
        searchRegex.test(keyword)
      );
      return nameMatch || keywordMatch;
    });
  }, [items, searchTerm]);

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
          <span key={charIndex} className='bg-yellow-200'>
            {text.slice(charIndex, charIndex + 1)}
          </span>
        );
        lastIndex = charIndex + 1;
      }
    });

    highlightedParts.push(text.slice(lastIndex));

    return highlightedParts;
  };

  const handleSelect = (item: SearchableItem<T>) => {
    onSelect?.(item);
  };

  return (
    <div>
      <div className=''>
        <Input
          ref={inputRef}
          type='text'
          placeholder={placeholder ?? "Search items..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 mb-2 border rounded'
        />
      </div>
      <div className='max-h-[200px] w-full overflow-y-auto'>
        {filteredItems.length === 0 ? (
          <div className='p-2 text-gray-500'>{emptyStateMessage}</div>
        ) : (
          filteredItems?.map((item) => (
            <div
              key={String(item.id)}
              onClick={() => handleSelect(item)}
              className='w-full p-2 text-sm cursor-pointer hover:bg-gray-100'
            >
              {highlightMatch(item.name)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
