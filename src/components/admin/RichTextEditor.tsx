'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon, 
  Unlink, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6 bg-[#1e1e1e] text-[#ededed] rounded-b border-x border-b border-white/10 cms-content',
      },
    },
  });

  if (!isMounted) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="w-full border border-white/10 rounded-lg overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-[#2a2a2a] border-b border-white/10 text-gray-300">
        <div className="flex items-center gap-1 mr-2 px-2 border-r border-white/10">
          <button
            onClick={(e) => { e.preventDefault(); editor?.chain().focus().undo().run(); }}
            disabled={!editor?.can().undo()}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor?.chain().focus().redo().run(); }}
            disabled={!editor?.can().redo()}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('bold') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('italic') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        
        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 1 }).run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 3 }).run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('heading', { level: 3 }) ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().setParagraph().run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('paragraph') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Normal Text"
        >
          <Type size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('bulletList') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('orderedList') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={(e) => { e.preventDefault(); addLink(); }}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor?.isActive('link') ? 'bg-accent text-white shadow-lg shadow-accent/20' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor?.chain().focus().unsetLink().run(); }}
          disabled={!editor?.isActive('link')}
          className="p-2 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
          title="Remove Link"
        >
          <Unlink size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="editor-surface">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
