"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";

/**
 * Editor WYSIWYG Berita (Tiptap) — dipakai admin untuk menulis konten artikel.
 *
 * Toolbar ringkas untuk admin non-teknis: tebal, miring, daftar, heading,
 * kutipan, garis pemisah, undo/redo. Outputnya HTML (getHTML) — lalu di-
 * sanitize dengan DOMPurify di server action sebelum disimpan.
 *
 * Komponen CLIENT — Tiptap butuh DOM. `immediatelyRender: false` mencegah
 * hydration mismatch (editor baru dibangun di browser).
 */

interface BeritaEditorProps {
  /** HTML awal (saat edit artikel). */
  initialHtml?: string;
  /** Dipanggil setiap konten berubah — nilai HTML dikirim ke form state. */
  onChange: (html: string) => void;
}

const toolbarBtn =
  "p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none";

export function BeritaEditor({ initialHtml = "", onChange }: BeritaEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false, // Link ditambahkan terpisah (bukan bawaan StarterKit)
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          title="Tebal (Bold)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${toolbarBtn} ${editor.isActive("bold") ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Miring (Italic)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${toolbarBtn} ${editor.isActive("italic") ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button
          type="button"
          title="Daftar poin"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${toolbarBtn} ${editor.isActive("bulletList") ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Daftar bernomor"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${toolbarBtn} ${editor.isActive("orderedList") ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button
          type="button"
          title="Sub-judul"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${toolbarBtn} ${editor.isActive("heading", { level: 2 }) ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Kutipan"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${toolbarBtn} ${editor.isActive("blockquote") ? "bg-emerald-100 text-emerald-700" : ""}`}
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Garis pemisah"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={toolbarBtn}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="ml-auto" />
        <button
          type="button"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={toolbarBtn}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={toolbarBtn}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Area tulis — class prose biar konten terlihat seperti hasil akhir. */}
      <div className="px-4 py-3">
        <EditorContent editor={editor} className="prose prose-sm prose-slate max-w-none min-h-[220px] focus:outline-none" />
      </div>
    </div>
  );
}
