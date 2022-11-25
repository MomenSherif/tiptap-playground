import {
  createContext,
  SVGProps,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { EditorContent, type Editor } from '@tiptap/react';
import { type Level } from '@tiptap/extension-heading';

function debounce(fn: Function, ms: number = 500) {
  let timerId: number;
  return function debouncedVersion(...args: any[]) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

interface RichTextEditorContextProps {
  editor: Editor | null;
}

const RichTextEditorContext = createContext<RichTextEditorContextProps>(null!);

export function useRichTextEditorContext() {
  const context = useContext(RichTextEditorContext);
  // TODO: __DEV__
  if (!context)
    throw new Error(
      'useRichTextEditorContext must be used within RichTextEditor.',
    );
  return context;
}

interface EditorProps extends React.ComponentProps<'div'> {
  editor: Editor | null;
}

export default function RichTextEditor({ editor, ...props }: EditorProps) {
  const contextValue = useMemo(() => ({ editor }), [editor]);

  return (
    <RichTextEditorContext.Provider value={contextValue}>
      <div {...props}>
        <Toolbar />
        <EditorContent editor={editor} />
      </div>
    </RichTextEditorContext.Provider>
  );
}

// TODO:  data-[active=true] add custom variant
// TODO: editor.can don't need chain
export function Toolbar() {
  const { editor } = useRichTextEditorContext();

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (!url) return;

    editor
      ?.chain()
      .focus()
      .setImage({
        src: url,
        title: 'nice',
        alt: ' ',
      })
      .run();
  }, [editor]);

  const changeColor = useCallback(
    debounce((value: string) => {
      editor?.chain().focus().setColor(value).run();
    }),
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="not-prose text-sm flex flex-wrap items-center gap-1 p-1 border-b mb-2 rounded sticky top-0 z-10">
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('bold')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('italic')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor?.can().chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('strike')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor?.can().chain().focus().toggleStrike().run()}
      >
        S
      </button>
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('underline')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        disabled={!editor?.can().chain().focus().toggleUnderline().run()}
      >
        U
      </button>

      {/* TODO: Group */}
      <div className="[&>*]:rounded-none flex items-center [&>*:first-child]:rounded-l [&>*:last-child]:rounded-r">
        <button
          className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
            editor?.isActive({ textAlign: 'left' })
              ? 'bg-indigo-100 text-indigo-600 '
              : 'hover:bg-indigo-100/50'
          }`}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          disabled={!editor?.can().chain().focus().setTextAlign('left').run()}
        >
          <TextAlignLeft className="w-6 h-6" />
        </button>
        <button
          className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
            editor?.isActive({ textAlign: 'center' })
              ? 'bg-indigo-100 text-indigo-600 '
              : 'hover:bg-indigo-100/50'
          }`}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          disabled={!editor?.can().chain().focus().setTextAlign('center').run()}
        >
          <TextAlignCenter className="w-6 h-6" />
        </button>
        <button
          className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
            editor?.isActive({ textAlign: 'right' })
              ? 'bg-indigo-100 text-indigo-600 '
              : 'hover:bg-indigo-100/50'
          }`}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          disabled={!editor?.can().chain().focus().setTextAlign('right').run()}
        >
          <TextAlignRight className="w-6 h-6" />
        </button>
      </div>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('superscript')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        disabled={!editor?.can().chain().focus().toggleSuperscript().run()}
      >
        <Superscript className="w-6 h-6" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('subscript')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        disabled={!editor?.can().chain().focus().toggleSubscript().run()}
      >
        <Subscript className="w-6 h-6" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('code')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor?.can().chain().focus().toggleCode().run()}
      >
        <InlineCode className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('codeblock')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() =>
          editor?.chain().focus().toggleCodeBlock({ language: 'js' }).run()
        }
        disabled={
          !editor
            ?.can()
            .chain()
            .focus()
            .toggleCodeBlock({ language: 'js' })
            .run()
        }
      >
        <CodeBlock className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
        onClick={addImage}
      >
        <Image className="w-5 h-5" />
      </button>

      <button
        data-active={editor?.isActive('paragraph')}
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium
          hover:bg-indigo-100/50
          data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-600`}
        onClick={() => editor?.chain().focus().setParagraph().run()}
        disabled={!editor?.can().chain().focus().setParagraph().run()}
      >
        P
      </button>

      {([1, 2, 3, 4, 5, 6] as Level[]).map(level => (
        <button
          key={level}
          className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
            editor?.isActive('heading', { level })
              ? 'bg-indigo-100 text-indigo-600 '
              : 'hover:bg-indigo-100/50'
          }`}
          onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
          disabled={
            !editor?.can().chain().focus().toggleHeading({ level }).run()
          }
        >
          H{level}
        </button>
      ))}

      <select
        value={editor.getAttributes('heading')?.level || ''}
        onChange={e => {
          if (!e.target.value) editor?.chain().focus().setParagraph().run();

          editor
            ?.chain()
            .focus()
            .setHeading({ level: +e.target.value as Level })
            .run();
        }}
      >
        <option value="">Paragraph</option>
        {([1, 2, 3, 4, 5, 6] as Level[]).map(level => (
          <option
            key={level}
            value={level}
            className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
              editor?.isActive('heading', { level })
                ? 'bg-indigo-100 text-indigo-600 '
                : 'hover:bg-indigo-100/50'
            }`}
          >
            Heading {level}
          </option>
        ))}
      </select>

      <Divider />

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('orderedList')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
      >
        <OrderedList className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('bulletList')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        disabled={!editor?.can().chain().focus().toggleBulletList().run()}
      >
        <UnOrderedList className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('blockquote')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
      >
        <BlockQuote className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <HorizontalRule className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
        onClick={() => editor?.chain().focus().setHardBreak().run()}
      >
        <HardBreak className="w-5 h-5" />
      </button>

      {/* We can add indentation utilities */}
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('taskList')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        disabled={!editor?.can().chain().focus().toggleTaskList().run()}
      >
        <TaskList className="w-5 h-5" />
      </button>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${
          editor?.isActive('highlight')
            ? 'bg-indigo-100 text-indigo-600 '
            : 'hover:bg-indigo-100/50'
        }`}
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
        disabled={!editor?.can().chain().focus().toggleHighlight().run()}
      >
        <HighLight className="w-5 h-5" />
      </button>

      {/* TODO: Highlight popover */}
      <div className="flex items-center space-x-px">
        <button
          className="w-4 h-4 rounded-sm border-gray-200 border shadow-sm"
          style={{ backgroundColor: '#09c' }}
          onClick={() =>
            editor?.chain().focus().setHighlight({ color: '#09c' }).run()
          }
        />
        <button
          className="w-4 h-4 rounded-sm border-gray-200 border shadow-sm"
          style={{ backgroundColor: '#9ece6a' }}
          onClick={() =>
            editor?.chain().focus().setHighlight({ color: '#9ece6a' }).run()
          }
        />
      </div>

      <div className="flex items-center space-x-px">
        <input
          type="color"
          onInput={e => changeColor(e.currentTarget.value)}
          value={editor?.getAttributes('textStyle').color}
          className="w-6 h-6"
        />
        <button
          className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
          onClick={() => editor?.chain().focus().unsetColor().run()}
          disabled={!editor?.can().chain().focus().unsetColor().run()}
        >
          <Rubber className="w-5 h-5" />
        </button>
      </div>

      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().chain().focus().undo().run()}
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        className={`inline-flex items-center justify-center h-7 min-w-[1.75rem] rounded-md font-medium ${'hover:bg-indigo-100/50'}`}
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().chain().focus().redo().run()}
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
}

export function Divider() {
  return <div className="bg-gray-200 basis-px self-stretch" />;
}

export function Superscript(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 7l8 10m-8 0l8-10m8 4h-4l3.5-4A1.73 1.73 0 0 0 17 5"
      ></path>
    </svg>
  );
}

export function Subscript(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 7l8 10m-8 0l8-10m8 13h-4l3.5-4a1.73 1.73 0 0 0-3.5-2"
      ></path>
    </svg>
  );
}

export function OrderedList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.003 2.5a.5.5 0 0 0-.723-.447l-1.003.5a.5.5 0 0 0 .446.895l.28-.14V6H.5a.5.5 0 0 0 0 1h2.006a.5.5 0 1 0 0-1h-.503V2.5zM5 3.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 3.25zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8.25zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75zM.924 10.32l.003-.004a.851.851 0 0 1 .144-.153A.66.66 0 0 1 1.5 10c.195 0 .306.068.374.146a.57.57 0 0 1 .128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 0 0 .5.5h2.003a.5.5 0 0 0 0-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845c0-.365-.118-.744-.377-1.038c-.268-.303-.658-.484-1.126-.484c-.48 0-.84.202-1.068.392a1.858 1.858 0 0 0-.348.384l-.007.011l-.002.004l-.001.002l-.001.001a.5.5 0 0 0 .851.525zM.5 10.055l-.427-.26l.427.26z"
      ></path>
    </svg>
  );
}

export function UnOrderedList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm3.75-1.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zM3 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0zm-1 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2z"
      ></path>
    </svg>
  );
}

export function BlockQuote(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M11.86 16.55a4.31 4.31 0 0 0-2.11.56a14.44 14.44 0 0 1 4.36-6a1.1 1.1 0 0 0-1.4-1.7c-4 3.25-5.78 7.75-5.78 10.54A5.08 5.08 0 0 0 10 24.58a4.4 4.4 0 0 0 1.88.44a4.24 4.24 0 1 0 0-8.47Z"
        className="clr-i-outline clr-i-outline-path-1"
      ></path>
      <path
        fill="currentColor"
        d="M23 16.55a4.29 4.29 0 0 0-2.11.56a14.5 14.5 0 0 1 4.35-6a1.1 1.1 0 1 0-1.39-1.7c-4 3.25-5.78 7.75-5.78 10.54a5.08 5.08 0 0 0 3 4.61A4.37 4.37 0 0 0 23 25a4.24 4.24 0 1 0 0-8.47Z"
        className="clr-i-outline clr-i-outline-path-2"
      ></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
  );
}

export function CodeBlock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m9.6 15.6l1.4-1.425L8.825 12L11 9.825L9.6 8.4L6 12Zm4.8 0L18 12l-3.6-3.6L13 9.825L15.175 12L13 14.175ZM5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14ZM5 5v14V5Z"
      ></path>
    </svg>
  );
}

export function InlineCode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6Zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6Z"
      ></path>
    </svg>
  );
}

export function HorizontalRule(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5 13q-.425 0-.713-.288Q4 12.425 4 12t.287-.713Q4.575 11 5 11h14q.425 0 .712.287q.288.288.288.713t-.288.712Q19.425 13 19 13Z"
      ></path>
    </svg>
  );
}

export function HardBreak(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5 12.5q-.425 0-.713-.288Q4 11.925 4 11.5t.287-.713Q4.575 10.5 5 10.5h12.25q1.575 0 2.663 1.087Q21 12.675 21 14.25q0 1.575-1.087 2.663Q18.825 18 17.25 18h-2.4l.55.55q.3.3.3.713q0 .412-.3.712t-.712.3q-.413 0-.713-.3L11.7 17.7q-.15-.15-.212-.325q-.063-.175-.063-.375t.063-.375q.062-.175.212-.325L14 14q.275-.275.688-.275q.412 0 .712.3t.288.725q-.013.425-.313.725L14.85 16h2.4q.725 0 1.238-.512q.512-.513.512-1.238t-.512-1.238q-.513-.512-1.238-.512ZM5 7q-.425 0-.713-.287Q4 6.425 4 6t.287-.713Q4.575 5 5 5h14q.425 0 .712.287Q20 5.575 20 6t-.288.713Q19.425 7 19 7Zm0 11q-.425 0-.713-.288Q4 17.425 4 17t.287-.712Q4.575 16 5 16h3.025q.425 0 .7.288Q9 16.575 9 17t-.287.712Q8.425 18 8 18Z"
      ></path>
    </svg>
  );
}

export function HighLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1.07em" height="1em" viewBox="0 0 544 512" {...props}>
      <path
        fill="currentColor"
        d="M0 479.98L99.92 512l35.45-35.45l-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83l-50.93 50.94l96.23 96.23l50.86-50.86l42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64l-173.34-173.34l-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"
      ></path>
    </svg>
  );
}

export function TextAlignLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M32 68a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm8 48h128a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 24H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-48 40H40a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"
      ></path>
    </svg>
  );
}

export function TextAlignCenter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M32 68a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm32 32a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm152 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-24 40H64a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"
      ></path>
    </svg>
  );
}

export function TextAlignRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M32 68a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm184 32H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm0 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm0 40H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"
      ></path>
    </svg>
  );
}

export function Image(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7l-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h7a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1ZM5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17l4.3 4.3Zm13-1a.89.89 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.21Zm4.71-14.71l-3-3a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-3 3a1 1 0 0 0 1.42 1.42L18 4.41V10a1 1 0 0 0 2 0V4.41l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
      ></path>
    </svg>
  );
}

export function Rubber(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="-1.5 -2.5 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.728 12.728L8.485 8.485l-5.657 5.657l2.122 2.121a3 3 0 0 0 4.242 0l3.536-3.535zM11.284 17H14a1 1 0 0 1 0 2H3a1 1 0 0 1-.133-1.991l-1.453-1.453a2 2 0 0 1 0-2.828L12.728 1.414a2 2 0 0 1 2.828 0L19.8 5.657a2 2 0 0 1 0 2.828L11.284 17z"
      ></path>
    </svg>
  );
}

export function TaskList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" {...props}>
      <path
        fill="currentColor"
        d="M5.854 4.354a.5.5 0 1 0-.708-.708L3.5 5.293l-.646-.647a.5.5 0 1 0-.708.708l1 1a.5.5 0 0 0 .708 0l2-2ZM8.75 4.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5ZM8 15.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75ZM5.854 9.854a.5.5 0 1 0-.708-.708L3.5 10.793l-.646-.647a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l2-2Zm0 4.292a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647l1.646-1.647a.5.5 0 0 1 .708 0Z"
      ></path>
    </svg>
  );
}

export function Undo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      version="1.1"
      {...props}
    >
      <path d="M379.776 635.904c39.36 35.968 48.32 41.344 50.496-25.856 3.968-49.152 0-103.552 0-103.552 1.408-3.072 86.464-35.008 227.072 25.856 140.544 60.928 235.456 251.008 252.16 310.528 1.344 34.368 46.144 100.736 50.432-1.344 0.576-166.656-64.512-341.12-230.336-441.152C574.976 307.072 446.4 316.608 432.192 321.472c-0.256 1.344-0.64 1.856-1.344 1.024-0.192-0.256 0.384-0.64 1.344-1.024 1.216-6.208-2.496-38.272-2.88-98.56 2.368-54.144-12.096-55.808-49.536-26.944C311.168 252.288 128 427.264 128 427.264S311.168 580.608 379.776 635.904z" />
    </svg>
  );
}

export function Redo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      version="1.1"
      {...props}
    >
      <path d="M708.16 635.904c-39.36 35.968-48.32 41.344-50.496-25.856-3.968-49.152 0-103.552 0-103.552-1.408-3.072-86.464-35.008-227.072 25.856C290.048 593.28 195.2 783.36 178.432 842.88 177.088 877.248 132.288 943.616 128 841.472c-0.576-166.656 64.512-341.12 230.336-441.152 154.624-93.248 283.264-83.776 297.408-78.848 0.256 1.344 0.64 1.856 1.344 1.024 0.192-0.256-0.384-0.64-1.344-1.024-1.216-6.208 2.496-38.272 2.88-98.56-2.368-54.144 12.096-55.808 49.536-26.944 68.544 56.32 251.776 231.36 251.776 231.36S776.768 580.608 708.16 635.904z" />
    </svg>
  );
}
