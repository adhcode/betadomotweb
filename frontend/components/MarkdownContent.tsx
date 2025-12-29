'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownContentProps {
    content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className="text-4xl font-cormorant font-normal text-gray-900 mt-12 mb-6 first:mt-0 leading-tight">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-3xl font-cormorant font-normal text-gray-900 mt-10 mb-5 leading-tight border-b border-gray-200 pb-3">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-2xl font-cormorant font-normal text-gray-900 mt-8 mb-4 leading-tight">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-xl font-cormorant font-normal text-gray-800 mt-6 mb-3 leading-tight">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="text-lg font-cormorant font-normal text-gray-800 mt-5 mb-2 leading-tight">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="text-base font-cormorant font-normal text-gray-800 mt-4 mb-2 leading-tight">
                        {children}
                    </h6>
                ),
                p: ({ children }) => (
                    <p className="text-base font-proza text-gray-700 leading-relaxed mb-5">
                        {children}
                    </p>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-gray-700 font-proza">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-gray-700 font-proza">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="leading-relaxed pl-1 font-proza">
                        {children}
                    </li>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 my-6 italic text-gray-700 font-proza">
                        {children}
                    </blockquote>
                ),
                code: ({ inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className="my-6 rounded-lg overflow-hidden shadow-sm">
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-gray-100 text-pink-600 px-2 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                        {children}
                    </pre>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                        <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-gray-50">
                        {children}
                    </thead>
                ),
                tbody: ({ children }) => (
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {children}
                    </tbody>
                ),
                tr: ({ children }) => (
                    <tr>
                        {children}
                    </tr>
                ),
                th: ({ children }) => (
                    <th className="px-4 py-3 text-left text-sm font-normal text-gray-900 font-proza">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-4 py-3 text-sm text-gray-700 font-proza">
                        {children}
                    </td>
                ),
                hr: () => (
                    <hr className="my-8 border-t-2 border-gray-200" />
                ),
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt || ''}
                        className="rounded-lg my-6 w-full shadow-md"
                    />
                ),
                strong: ({ children }) => (
                    <strong className="font-medium text-gray-900 font-proza">
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className="italic text-gray-800 font-proza">
                        {children}
                    </em>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
