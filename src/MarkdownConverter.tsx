import React, { ChangeEvent, useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Tooltip } from 'react-tooltip'
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { renderToStaticMarkup } from 'react-dom/server';
import gfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import { FaImage, FaLink, FaCog, FaEye, FaCode, FaPen, FaTable, FaCopy, FaDownload } from 'react-icons/fa';
import initialMarkdown from './initialMarkdown';
import BarButton from './components/BarButton';
import ConfigFieldset from './components/ConfigFieldset';
import ClassesSelector from './components/ClassesSelector';

interface TailwindClasses {
  [key: string]: string;
}

type EditionModes = 'edit' | 'preview' | 'code' | 'config';

const MarkdownConverter: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [tailwindClasses, setTailwindClasses] = useState<TailwindClasses>({
    h1: 'text-3xl font-bold mb-4 text-gray-800',
    h2: 'text-2xl font-bold mb-4 text-gray-800',
    h3: 'text-xl font-bold mb-4 text-gray-800',
    p: 'mb-2 text-base text-gray-800',
    a: 'text-blue-500 hover:text-blue-700 hover:underline',
    img: 'max-w-full my-4',
    table: 'table-auto my-4',
    strong: 'font-bold',
    em: 'italic',
    tr: 'border border-gray-200 even:bg-gray-50 odd:bg-white',
    td: 'border border-gray-200 p-1',
    th: 'border border-gray-200 p-1',
  });

  interface BehaviorConfig {
    shouldOpenLinksInNewTab: boolean;
    shouldShowLineNumbers: boolean;
  }

  const editionButtons = [
    {
        label: <FaPen className="text-[18px]" />,
        edition: 'edit',
    },
    {
        label: <FaCode className="text-[18px]" />,
        edition: 'code',
    },
    {
        label: <FaEye className="text-[18px]" />,
        edition: 'preview',
    }
  ]


  const [behaviorConfigs, setBehaviorConfigs] = useState<BehaviorConfig>({
    shouldOpenLinksInNewTab: true,
    shouldShowLineNumbers: true
  });

  const [isShowingExtraElements, setIsShowingExtraElements] = useState<boolean>(false);

  const [editionMode, setEditionMode] = useState<EditionModes>('edit');
  const [isEditionSelectionOpen, setIsEditionSelectionOpen] = useState<boolean>(false);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
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

    const handleConfigChange = (selectedOptions: any, property: string) => {
        setTailwindClasses(prevState => ({
            ...prevState,
            [property]: selectedOptions.map((option: any) => option.value).join(' ')
        }));
    };

    const handleDownload = () => {
        const content = editionMode === 'edit' ? markdown : htmlString;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = editionMode === 'edit' ? 'markdown.md' : 'generated.html';
        a.click();
        URL.revokeObjectURL(url);    
    };  

  const components = {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h1: ({ node, ...props }: any) => <h1 aria-label="header" {...props} className={tailwindClasses.h1} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h2: ({ node, ...props }: any) => <h2 aria-label="header" {...props} className={tailwindClasses.h2} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h3: ({ node, ...props }: any) => <h3 aria-label="header" {...props} className={tailwindClasses.h3} />,
    p: ({ node, ...props }: any) => <p className={tailwindClasses.p} {...props} />,
    a: ({ node, ...props }: any) => <a aria-label="Link" className={tailwindClasses.a} {...props} target={behaviorConfigs.shouldOpenLinksInNewTab && '_blank'} />,
    img: ({ node, ...props }: any) => <img alt="" className={tailwindClasses.img} {...props} />,
    table: ({ node, ...props }: any) => <table className={tailwindClasses.table} {...props} />,
    strong: ({ node, ...props }: any) => <strong className={tailwindClasses.strong} {...props} />,
    em: ({ node, ...props }: any) => <em className={tailwindClasses.em} {...props} />,
    tr: ({ node, ...props }: any) => <tr className={tailwindClasses.tr} {...props} />,
    td: ({ node, ...props }: any) => <td className={tailwindClasses.td} {...props} />,
    th: ({ node, ...props }: any) => <th className={tailwindClasses.th} {...props} />,
  };

  // Converte o JSX para uma string HTML
  const htmlString = `${renderToStaticMarkup(
    <Markdown components={components} remarkPlugins={[gfm]}>
      {markdown}
    </Markdown>
  )}`;

  return (
    <main className='container m-auto min-h-screen px-4 my-10 flex flex-col'>
        <Helmet>
            <title>Taildown - Markdown editor with Tailwind CSS classes</title>
            <meta name="description" content="A simple yet powerful Markdown editor for your writing needs." />
            <meta name="keywords" content="Taildown, Markdown, Markdown Editor, React, Tailwind CSS" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>        
        <h1 className='text-base mt-5 text-slate-800 text-left mb-5'>
            <strong>Taildown</strong>
            <span>: Markdown Editor with Tailwind CSS</span>
        </h1> 
        <div className="flex items-center flex-col">
        <div className="flex gap-x-2 bg-gray-50 p-2 border border-gray-200 rounded-t-md w-full divide max-h-[58px]">
            <BarButton 
                label={<>H1</>} 
                onClick={() => handleMarkdownInsert('\n# ')} 
                disabled={editionMode !== 'edit'}
            />
            <BarButton 
                label={<>H2</>} 
                disabled={editionMode !== 'edit'}
                onClick={() => handleMarkdownInsert('\n## ')} />
            <BarButton 
                label={<>H3</>} 
                disabled={editionMode !== 'edit'}
                onClick={() => handleMarkdownInsert('\n### ')} />
            <BarButton 
                label={<FaImage className="text-[18px]" />} 
                disabled={editionMode !== 'edit'}
                onClick={() => handleMarkdownInsert('![Alt Text](image.png)')} 
            />
            <BarButton
                label={<FaLink className="text-[18px]" />}
                disabled={editionMode !== 'edit'}
                onClick={() => handleMarkdownInsert('\n[Link Text](example.com)')}
            />
            <BarButton
                label={<FaTable className="text-[18px]" />}
                disabled={editionMode !== 'edit'}
                onClick={() => handleMarkdownInsert('\n|   |   |   |\n|---|---|---|')}
            />            
            <hr className='bg-gray-200 h-[inherit] ml-auto w-[1px]' />
            <Tooltip id="copy-tooltip" />
            <BarButton
                label={
                    <FaCopy 
                        data-tooltip-id="copy-tooltip"
                        data-tooltip-content="Copy to clipboard"
                        data-tooltip-place="top"
                        className="text-[18px]" />}    
                onClick={() => console.log(htmlString)}
            />
            <Tooltip id="download-tooltip" />
            <BarButton
                label={                    
                <FaDownload 
                    className="text-[18px]" 
                    data-tooltip-id="download-tooltip"
                    data-tooltip-content={editionMode === 'edit' ? 'Download Markdown' : 'Download HTML'}
                    data-tooltip-place="top"                    
                />}
                onClick={handleDownload}
            />            
            <hr className='bg-gray-200 h-[inherit] w-[1px]' />
            <Tooltip id="edition-tooltip" />
            <div 
                onClick={() => setIsEditionSelectionOpen(!isEditionSelectionOpen)}
                onMouseOver={() => setIsEditionSelectionOpen(true)}
                onMouseLeave={() => setIsEditionSelectionOpen(false)}
                data-tooltip-content="Change edition mode"
                data-tooltip-place="top"
                data-tooltip-id="edition-tooltip"
                className={`flex flex-col z-20 h-max border  rounded-md ${isEditionSelectionOpen ? 'overflow-visible bg-white h-content gap-1 p-1 m-[-4px]' : 'overflow-hidden max-h-10'}  `}>
                { editionButtons.sort((a, b) => a.edition === editionMode ? -1 : 1).map((button, index) => (
                    <BarButton
                        key={index}
                        label={button.label}
                        onClick={() => setEditionMode(button.edition as EditionModes)}
                        active={editionMode === button.edition}
                    />
                ))}
            </div>
            <Tooltip id="config-tooltip" />
            <BarButton
                label={
                    <FaCog 
                        data-tooltip-id="config-tooltip"
                        data-tooltip-content="Settings"
                        data-tooltip-place="top"
                        className="text-[18px]" 
                    />}
                onClick={() => setEditionMode('config')}
                active={editionMode === 'config'}
            />            
        </div>

        {editionMode === 'preview' && (
            <div className="w-full border-x border-b border-gray-200 rounded-b-md min-h-[300px] text-left p-4">
            <Markdown components={components} remarkPlugins={[gfm]}>
                {markdown}
            </Markdown>
            </div>
        )}

        {editionMode === 'code' && (
            <div className="w-full border-x border-b border-gray-200 rounded-b-md h-[300px]">
                <SyntaxHighlighter 
                    language="markup"                    
                    showLineNumbers={behaviorConfigs.shouldShowLineNumbers}
                    customStyle={{ margin: '0', height: '100%' }}
                    style={materialLight}>
                    {htmlString}
                </SyntaxHighlighter>
            </div>
        )}
        {editionMode === 'config' && (
            <div className="w-full border-x border-b border-gray-200 rounded-b-md p-4 flex flex-col text-left">
            <h2 className="text-xl font-semibold mb-2">Settings:</h2>
            <ConfigFieldset
                legend="Tailwind classes"
                description="Set the Tailwind classes for each element."
                >
                <div className="mb-4">
                    <ClassesSelector
                        name="H1:"
                        value={tailwindClasses.h1}
                        onChange={e => handleConfigChange(e, 'h1')}
                    />
                </div>        
                <div className="mb-4">
                <label>
                    <ClassesSelector
                        name="H2:"
                        value={tailwindClasses.h2}
                        onChange={e => handleConfigChange(e, 'h2')}
                    />
                </label>
                </div>
                <div className="mb-4">
                <label>
                    <ClassesSelector
                        name="H3:"
                        value={tailwindClasses.h3}
                        onChange={e => handleConfigChange(e, 'h3')}
                    />
                </label>
                </div>
                <div className="mb-4">
                    <ClassesSelector
                        name="Paragraph:"
                        value={tailwindClasses.p}
                        onChange={e => handleConfigChange(e, 'p')}
                    />
                </div>
                <div className="mb-4">
                    <ClassesSelector
                        name="Image:"
                        value={tailwindClasses.img}
                        onChange={e => handleConfigChange(e, 'img')}
                    />
                </div>
                <div className="mb-4">
                    <ClassesSelector
                        name="Table:"
                        value={tailwindClasses.table}
                        onChange={e => handleConfigChange(e, 'table')}
                    />
                </div>
                <div className={`${isShowingExtraElements ? 'flex flex-col' : 'hidden' }`}>
                    <div className="mb-4">
                        <ClassesSelector
                            name="Table Row:"
                            value={tailwindClasses.tr}
                            onChange={e => handleConfigChange(e, 'tr')}
                        />
                    </div>
                    <div className="mb-4">
                        <ClassesSelector
                            name="Table Cell:"
                            value={tailwindClasses.td}
                            onChange={e => handleConfigChange(e, 'td')}
                        />
                    </div>                            
                    <div className="mb-4">
                        <ClassesSelector
                            name="Strong:"
                            value={tailwindClasses.strong}
                            onChange={e => handleConfigChange(e, 'strong')}
                        />
                    </div>
                    <div className="mb-4">
                        <ClassesSelector
                            name="Emphasis:"
                            value={tailwindClasses.em}
                            onChange={e => handleConfigChange(e, 'em')}
                        />
                    </div>
                    <div className="mb-4">
                        <ClassesSelector
                            name="Link:"
                            value={tailwindClasses.a}
                            onChange={e => handleConfigChange(e, 'a')}
                        />
                    </div>    
                </div>
                <span 
                    onClick={() => setIsShowingExtraElements(!isShowingExtraElements)}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition cursor-pointer">
                    {isShowingExtraElements ? 'Hide extra elements' : 'Show extra elements'} 
                </span>
                </ConfigFieldset>
                <ConfigFieldset legend="Behavior">
                    <div className="mb-4">
                        <label>
                            <input 
                                type="checkbox" 
                                className='mr-2'
                                checked={behaviorConfigs.shouldOpenLinksInNewTab} 
                                onChange={() => setBehaviorConfigs({ ...behaviorConfigs, shouldOpenLinksInNewTab: !behaviorConfigs.shouldOpenLinksInNewTab })} 
                            />
                            Open links in new tab
                        </label>
                    </div>
                    <div className="mb-4">
                        <label>
                            <input 
                                type="checkbox" 
                                className='mr-2'
                                checked={behaviorConfigs.shouldShowLineNumbers} 
                                onChange={() => setBehaviorConfigs({ ...behaviorConfigs, shouldShowLineNumbers: !behaviorConfigs.shouldShowLineNumbers })} 
                            />
                            Show line numbers
                        </label>
                    </div>
                </ConfigFieldset>
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
    </main>
  );
};

export default MarkdownConverter;
