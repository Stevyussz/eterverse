"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { TextB, TextItalic, TextStrikethrough, ListBullets, ListNumbers, Link as LinkIcon, Quotes } from "@phosphor-icons/react";
import { useEffect, useState } from 'react';

interface MarkdownTextareaProps {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export function MarkdownTextarea({ name, placeholder, defaultValue = "", required }: MarkdownTextareaProps) {
  const [markdownContent, setMarkdownContent] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
      }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      // Get the markdown output
      const md = (editor.storage as any).markdown.getMarkdown();
      setMarkdownContent(md);
    },
    editorProps: {
      attributes: {
        className: 'prose prose-invert prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 max-w-none text-eter-starlight',
      },
    },
  });

  // Handle outside defaultValue changes (if any)
  useEffect(() => {
    if (editor && defaultValue !== (editor.storage as any).markdown.getMarkdown()) {
      editor.commands.setContent(defaultValue);
    }
  }, [defaultValue, editor]);

  if (!editor) {
    return (
      <div className="flex flex-col border border-white/10 rounded-sm bg-black/50 overflow-hidden min-h-[150px]">
        {/* Loading state or fallback */}
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-white/10 rounded-sm bg-black/50 overflow-hidden focus-within:border-eter-cyan transition-colors group">
      
      {/* Hidden input to pass markdown to FormData */}
      <input type="hidden" name={name} value={markdownContent} required={required} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-white/[0.02]">
        <ToolbarButton 
          icon={<TextB size={18} />} 
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()} 
          title="Bold" 
        />
        <ToolbarButton 
          icon={<TextItalic size={18} />} 
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          title="Italic" 
        />
        <ToolbarButton 
          icon={<TextStrikethrough size={18} />} 
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          title="Strikethrough" 
        />
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <ToolbarButton 
          icon={<ListBullets size={18} />} 
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          title="Bullet List" 
        />
        <ToolbarButton 
          icon={<ListNumbers size={18} />} 
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          title="Numbered List" 
        />
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <ToolbarButton 
          icon={<LinkIcon size={18} />} 
          isActive={editor.isActive('link')}
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }} 
          title="Link" 
        />
        <ToolbarButton 
          icon={<Quotes size={18} />} 
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          title="Quote" 
        />
      </div>

      {/* Textarea Area (TipTap Content) */}
      <EditorContent editor={editor} className="w-full bg-transparent resize-y cursor-text" onClick={() => editor.commands.focus()} />
      
    </div>
  );
}

function ToolbarButton({ icon, onClick, title, isActive }: { icon: React.ReactNode, onClick: () => void, title: string, isActive?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-sm transition-colors ${isActive ? 'bg-eter-cyan/20 text-eter-cyan' : 'text-zinc-400 hover:text-eter-starlight hover:bg-white/10'}`}
    >
      {icon}
    </button>
  );
}
