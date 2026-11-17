"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { PixelIcon } from "@/components/pixel/PixelIcon";
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
        className: 'prose prose-eter prose-sm sm:prose-base focus:outline-none min-h-[160px] p-4 max-w-none',
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
      <div className="px-input !p-0 min-h-[200px]" aria-busy="true">
        {/* Loading state or fallback */}
      </div>
    );
  }

  return (
    <div className="px-input !p-0 flex flex-col focus-within:outline-3 focus-within:outline-dashed focus-within:outline-gold-d focus-within:outline-offset-4">
      
      {/* Hidden input to pass markdown to FormData */}
      <input type="hidden" name={name} value={markdownContent} required={required} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 border-b-2 border-ink/15 bg-panel-2" role="toolbar" aria-label="Format teks">
        <ToolbarButton 
          icon={<span className="font-bold">B</span>} 
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()} 
          title="Bold" 
        />
        <ToolbarButton 
          icon={<span className="italic">I</span>} 
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          title="Italic" 
        />
        <ToolbarButton 
          icon={<span className="line-through">S</span>} 
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          title="Strikethrough" 
        />
        <div className="w-0.5 h-5 bg-ink/15 mx-1" aria-hidden></div>
        <ToolbarButton 
          icon={<span>•≡</span>} 
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          title="Bullet List" 
        />
        <ToolbarButton 
          icon={<span>1.</span>} 
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          title="Numbered List" 
        />
        <div className="w-0.5 h-5 bg-ink/15 mx-1" aria-hidden></div>
        <ToolbarButton 
          icon={<PixelIcon name="link" size={14} />} 
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
          icon={<span>&ldquo;</span>} 
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
      aria-label={title}
      aria-pressed={!!isActive}
      className="px-slot w-9 h-9 inline-flex items-center justify-center font-pixel text-sm"
    >
      {icon}
    </button>
  );
}
