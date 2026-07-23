import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-slate-50 mt-5 mb-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-slate-50 mt-5 mb-2.5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-100 mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-200 leading-relaxed mb-3 last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-50">{children}</strong>
  ),
  em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-3 space-y-1.5 text-slate-200 marker:text-indigo-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-3 space-y-1.5 text-slate-200 marker:text-indigo-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-indigo-500/50 pl-4 my-3 text-slate-400 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-[13px] font-mono text-indigo-300">
        {children}
      </code>
    ) : (
      <code className="block font-mono text-[13px] text-slate-200">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-3 overflow-x-auto">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-800 bg-slate-900 px-3 py-2 text-left text-slate-200 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-800 px-3 py-2 text-slate-300">
      {children}
    </td>
  ),
  hr: () => <hr className="border-slate-800 my-4" />,
};

const Markdown = ({ children, className = "" }) => {
  return (
    <div className={`text-sm ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children || ""}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
