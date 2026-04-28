'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ComponentPropsWithoutRef } from 'react';

interface MarkdownContentProps {
    content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
    const cleanedContent = content.replace(/<NewsletterSignup\s*\/?>\s*/g, '');

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className="mt-14 mb-6 text-4xl font-cormorant font-normal leading-[1.08] tracking-[-0.02em] text-gray-900 first:mt-0 md:text-5xl">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="mt-12 mb-5 border-b border-gray-200 pb-3 text-3xl font-cormorant font-normal leading-tight tracking-[-0.015em] text-gray-900 md:text-4xl">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="mt-10 mb-4 text-2xl font-cormorant font-normal leading-tight tracking-[-0.01em] text-gray-900 md:text-[2rem]">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="mt-8 mb-3 text-xl font-cormorant font-normal leading-tight text-gray-800">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="mt-6 mb-2 text-lg font-cormorant font-normal leading-tight text-gray-800">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="mt-5 mb-2 text-base font-cormorant font-normal leading-tight text-gray-800">
                        {children}
                    </h6>
                ),
                p: ({ children }) => (
                    <p className="mb-6 text-[1.05rem] leading-8 text-gray-700 font-proza md:text-[1.1rem]">
                        {children}
                    </p>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className="text-[#1f5d6c] underline decoration-gray-300 underline-offset-4 transition-colors hover:text-[#173f49] hover:decoration-[#1f5d6c]"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => (
                    <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-700 font-proza marker:text-gray-400">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-700 font-proza marker:text-gray-400">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="pl-1 leading-8 font-proza text-gray-700">
                        {children}
                    </li>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="my-8 border-l-4 border-gray-300 bg-gray-50 py-4 pl-6 pr-4 italic text-gray-700 font-proza">
                        {children}
                    </blockquote>
                ),
                code: ({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
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
                        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-800" {...props}>
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => (
                    <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">
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
                    <hr className="my-10 border-t border-gray-200" />
                ),
                img: ({ src, alt }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={src}
                        alt={alt || ''}
                        className="my-8 w-full rounded-sm border border-gray-100 object-cover"
                    />
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 font-proza">
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
            {cleanedContent}
        </ReactMarkdown>
    );
}
