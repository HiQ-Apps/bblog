"use client";

import { ScrollArea } from "../ui/scroll-area";

type TagsWrapperProps = {
  tags: string[];
  selected: string[]; // <- controlled selection
  onChange: (next: string[]) => void; // <- report new selection
};

type TagProps = {
  tag: string;
  selected: boolean;
  onToggle: (tag: string) => void;
};

const Tag = ({ tag, selected, onToggle }: TagProps) => (
  <div
    className={`transition-all duration-200 ease-in-out transform hover:scale-105 cursor-pointer px-3 py-1 text-sm font-mont rounded-sm
      ${selected ? "bg-accent text-primary scale-105" : "bg-secondary text-black"}
    `}
    onClick={() => onToggle(tag)}
    role="button"
    aria-pressed={selected}
  >
    {tag}
  </div>
);

export const TagsWrapper = ({ tags, selected, onChange }: TagsWrapperProps) => {
  const toggle = (tag: string) => {
    const isOn = selected.includes(tag);
    const next = isOn ? selected.filter((t) => t !== tag) : [...selected, tag];
    onChange(next);
  };

  return (
    <div>
      <ScrollArea
        className="
          h-28 w-full border-b-1 border-accent
          [&_[data-slot=scroll-area-thumb]]:bg-accent/40
          [&_[data-slot=scroll-area-thumb]]:hover:bg-accent/20
          [&_[data-slot=scroll-area-scrollbar]]:bg-transparent"
      >
        <div className="flex flex-wrap gap-2 justify-center content-start p-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              tag={tag}
              selected={selected.includes(tag)}
              onToggle={toggle}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-row flex-wrap gap-2 mt-2 text-sm font-mont items-center p-4">
        <span className="mr-2">Selected:</span>
        {selected.length > 0 ? (
          selected.map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 rounded-sm bg-accent text-xs text-white cursor-pointer hover:bg-red-800"
              onClick={() => onChange(selected.filter((t) => t !== tag))}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </div>
    </div>
  );
};
