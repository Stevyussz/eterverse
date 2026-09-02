"use client";

import { useState, useRef } from "react";
import { TextB, TextItalic, TextStrikethrough, ListBullets, ListNumbers, Link as LinkIcon, Quotes } from "@phosphor-icons/react";

interface MarkdownTextareaProps {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export function MarkdownTextarea({ name, placeholder, defaultValue, required }: MarkdownTextareaProps) {
  const [value, setValue] = useState(defaultValue || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    setValue(newText);

    // Set focus back and adjust selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleToolbarClick = (e: React.MouseEvent, before: string, after: string = "") => {
    e.preventDefault(); // Prevent form submission
    insertText(before, after);
  };

  return (
    <div className="flex flex-col border border-white/10 rounded-sm bg-black/50 overflow-hidden focus-within:border-eter-cyan transition-colors group">
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-white/[0.02]">
        <ToolbarButton 
          icon={<TextB size={18} />} 
          onClick={(e) => handleToolbarClick(e, "**", "**")} 
          title="Bold" 
        />
        <ToolbarButton 
          icon={<TextItalic size={18} />} 
          onClick={(e) => handleToolbarClick(e, "*", "*")} 
          title="Italic" 
        />
        <ToolbarButton 
          icon={<TextStrikethrough size={18} />} 
          onClick={(e) => handleToolbarClick(e, "~~", "~~")} 
          title="Strikethrough" 
        />
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <ToolbarButton 
          icon={<ListBullets size={18} />} 
          onClick={(e) => handleToolbarClick(e, "- ", "")} 
          title="Bullet List" 
        />
        <ToolbarButton 
          icon={<ListNumbers size={18} />} 
          onClick={(e) => handleToolbarClick(e, "1. ", "")} 
          title="Numbered List" 
        />
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <ToolbarButton 
          icon={<LinkIcon size={18} />} 
          onClick={(e) => handleToolbarClick(e, "[", "](url)")} 
          title="Link" 
        />
        <ToolbarButton 
          icon={<Quotes size={18} />} 
          onClick={(e) => handleToolbarClick(e, "> ", "")} 
          title="Quote" 
        />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        rows={8}
        className="w-full bg-transparent p-4 text-sm text-eter-starlight focus:outline-none font-mono resize-y min-h-[150px]"
        placeholder={placeholder}
      />
    </div>
  );
}

function ToolbarButton({ icon, onClick, title }: { icon: React.ReactNode, onClick: (e: React.MouseEvent) => void, title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 text-zinc-400 hover:text-eter-starlight hover:bg-white/10 rounded-sm transition-colors"
    >
      {icon}
    </button>
  );
}
