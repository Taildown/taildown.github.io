import React, { ChangeEvent, useState } from 'react';
import Markdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { renderToStaticMarkup } from 'react-dom/server';
import gfm from 'remark-gfm';
import { FaImage, FaLink, FaCog, FaEye, FaCode, FaPen, FaTable } from 'react-icons/fa';

interface TailwindClasses {
  [key: string]: string;
}

type EditionModes = 'edit' | 'preview' | 'code' | 'config';

const MarkdownConverter: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [tailwindClasses, setTailwindClasses] = useState<TailwindClasses>({
    p: 'mb-4',
    a: 'text-blue-500',
    img: 'w-full',
    table: 'table-auto'
  });
  const [editionMode, setEditionMode] = useState<EditionModes>('edit');

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const handleTailwindChange = (element: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setTailwindClasses({ ...tailwindClasses, [element]: e.target.value });
  };

  const handleMarkdownInsert = (textToInsert: string) => {
    const textarea = document.getElementById('markdownTextArea') as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const newText = markdown.substring(0, selectionStart) + textToInsert + markdown.substring(selectionEnd);
    setMarkdown(newText);

    textarea.selectionStart = selectionStart + textToInsert.length;
    textarea.selectionEnd = selectionStart + textToInsert.length;
    textarea.focus();
  };

  const handleConfigChange = (element: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setTailwindClasses({ ...tailwindClasses, [element]: e.target.value });
  };

  const components = {
    h1: ({ node, ...props }: any) => <h1 aria-label="header" {...props} className={tailwindClasses.h1} />,
    h2: ({ node, ...props }: any) => <h2 aria-label="header" {...props} className={tailwindClasses.h2} />,
    h3: ({ node, ...props }: any) => <h3 aria-label="header" {...props} className={tailwindClasses.h3} />,
    p: ({ node, ...props }: any) => <p className={tailwindClasses.p} {...props} />,
    a: ({ node, ...props }: any) => <a aria-label="Link" className={tailwindClasses.a} {...props} />,
    img: ({ node, ...props }: any) => <img alt="" className={tailwindClasses.img} {...props} />,
    table: ({ node, ...props }: any) => <table className={tailwindClasses.table} {...props} />,
  };

  // Converte o JSX para uma string HTML
  const htmlString = `${renderToStaticMarkup(
    <Markdown components={components} remarkPlugins={[gfm]}>
      {markdown}
    </Markdown>
  )}`;

  return (
    <div className="container m-auto flex items-center flex-col mt-10 px-4 min-h-screen">
      {/* Botões para inserir Markdown */}
      <div className="flex gap-x-2 bg-gray-50 p-2 border border-gray-200 rounded-t-md w-full divide">
        <button
          onClick={() => handleMarkdownInsert('\n# ')}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded"
        >
          H1
        </button>
        <button
          onClick={() => handleMarkdownInsert('\n## ')}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded"
        >
          H2
        </button>
        <button
          onClick={() => handleMarkdownInsert('\n### ')}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded"
        >
          H3
        </button>
        <button
          onClick={() => handleMarkdownInsert('![Alt Text](image.png)')}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded flex gap-2"
        >
          <FaImage className="text-[18px]" />
        </button>
        <button
          onClick={() => handleMarkdownInsert(`\n[Link Text](example.com)`)}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded"
        >
          <FaLink className="text-[18px]" />
        </button>
        <button
          onClick={() => handleMarkdownInsert(`\n|   |   |   |\n|---|---|---|`)}
          className="px-3 py-2  text-gray-600 hover:bg-gray-100 transition rounded"
        >
          <FaTable className="text-[18px]" />
        </button>
        <button
          onClick={() => setEditionMode('edit')}
          className={`px-3 py-2 text-slate-500 hover:bg-slate-100 rounded ml-auto ${
            editionMode === 'edit' && 'shadow-inner bg-slate-100'
          }`}
        >
          <FaPen className="text-[18px]" />
        </button>
        <button
          onClick={() => setEditionMode('code')}
          className={`px-3 py-2 text-slate-500 hover:bg-slate-100 rounded ${
            editionMode === 'code' && 'shadow-inner bg-slate-100'
          }`}
        >
          <FaCode className="text-[18px]" />
        </button>
        <button
          onClick={() => setEditionMode('preview')}
          className={`px-3 py-2 text-slate-500 hover:bg-slate-100 rounded ${
            editionMode === 'preview' && 'shadow-inner bg-slate-100'
          }`}
        >
          <FaEye className="text-[18px]" />
        </button>
        <button
          onClick={() => setEditionMode('config')}
          className={`px-3 py-2 text-slate-500 hover:bg-slate-100 rounded ${
            editionMode === 'config' && 'shadow-inner bg-slate-100'
          }`}
        >
          <FaCog className="text-[18px]" />
        </button>
      </div>

      {editionMode === 'preview' && (
        <div className="w-full border-x border-b border-gray-200 rounded-b-md min-h-[300px] text-left p-4">
          <Markdown components={components} remarkPlugins={[gfm]}>
            {markdown}
          </Markdown>
        </div>
      )}

      {editionMode === 'code' && (
        <div className="w-full border-x border-b border-gray-200 rounded-b-md min-h-[300px]">
            <SyntaxHighlighter 
                language="html" 
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{ margin: '0', height: '100%' }}
                style={materialLight}>
                {htmlString}
            </SyntaxHighlighter>
        </div>
      )}
      {editionMode === 'config' && (
        <div className="w-full border-x border-b border-gray-200 rounded-b-md p-4 flex flex-col text-left">
          <h2 className="text-xl font-semibold mb-2">Configurações:</h2>
          <fieldset className="border p-4 border-gray-100 mt-2">
            <legend className="bg-slate-50 px-2 border boder-slate-100 text-xs font-semibold">Tailwind classes</legend>
            <div className="mb-4">
              <label>
                H1:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.h1} onChange={handleConfigChange('h1')} />
              </label>
            </div>
            <div className="mb-4">
              <label>
                H2:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.h2} onChange={handleConfigChange('h2')} />
              </label>
            </div>
            <div className="mb-4">
              <label>
                H3:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.h3} onChange={handleConfigChange('h3')} />
              </label>
            </div>
            <div className="mb-4">
              <label>
                Paragraph:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.p} onChange={handleConfigChange('p')} />
              </label>
            </div>
            <div className="mb-4">
              <label>
                Image:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.img} onChange={handleConfigChange('img')} />
              </label>
            </div>
            <div className="mb-4">
              <label>
                Link:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.a} onChange={handleConfigChange('a')} />
              </label>
            </div>
          </fieldset>
          <fieldset className="border p-4 border-gray-100 mt-2">
            <legend className="bg-slate-50 px-2 border boder-slate-100 text-xs font-semibold">Behavior</legend>
            <div className="mb-4">
              <label>
                Link:
                <input type="text" className="border ml-3 rounded px-1" value={tailwindClasses.a} onChange={handleConfigChange('a')} />
              </label>
            </div>
          </fieldset>
        </div>
      )}
      {editionMode === 'edit' && (
        <textarea
          id="markdownTextArea"
          onChange={handleMarkdownChange}
          value={markdown}
          className="w-full border-x border-b border-gray-200 p-4 rounded-b-md min-h-[300px] resize-none outline-none"
          placeholder="Enter markdown here..."
        />
      )}
    </div>
  );
};

export default MarkdownConverter;