import { useState } from 'react';
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/tokyo-night-dark.css';
import { lowlight } from 'lowlight';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

import RichTextEditor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col py-6">
      <EditorDemo />
    </div>
  );
}

export default App;

// TODO: Abstract
function CustomCodeBlock() {
  return (
    <NodeViewWrapper as="pre">
      <NodeViewContent as="code" />
    </NodeViewWrapper>
  );
}

function EditorDemo() {
  const [content, setContent] = useState(``);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({
        placeholder: 'Enter something...',
        emptyEditorClass:
          'first:before:absolute first:before:content-[attr(data-placeholder)] first:before:text-gray-400 first:before:pointer-events-none',
      }),
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      TextAlign.configure({
        alignments: ['left', 'center', 'right'],
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CustomCodeBlock);
        },
      }).configure({
        lowlight,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose !pl-0',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex space-x-2',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'p-4 focus:outline-none',
      },
    },
    autofocus: true,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="px-4 w-full max-w-5xl mx-auto">
      <RichTextEditor
        editor={editor}
        className="sm:max-w-none border rounded w-full prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-img:inline-block bg-white"
      />
    </div>
  );
}
