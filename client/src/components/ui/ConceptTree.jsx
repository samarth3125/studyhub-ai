import { Brain } from "lucide-react";

// A clean, dependency-free hierarchical concept tree: root concept ->
// section headings -> key points. Used as the visual mind-map view in
// Mind Space (React Flow / Mermaid are not part of this project's
// dependencies, so this CSS-based tree is the supported fallback).
const Branch = ({ node, depth = 0 }) => {
  if (depth === 0) {
    return (
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/40 text-indigo-200 rounded-xl px-4 py-2 font-semibold text-sm mb-3">
          <Brain size={15} />
          {node.label}
        </div>
        <div className="pl-3 border-l border-slate-800 space-y-4 w-full">
          {node.children.map((child, i) => (
            <Branch key={i} node={child} depth={1} />
          ))}
        </div>
      </div>
    );
  }

  if (depth === 1) {
    return (
      <div className="relative pl-4">
        <span className="absolute left-0 top-3 w-3 h-px bg-slate-800" />
        <div className="inline-block bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 mb-2">
          {node.label}
        </div>
        {node.children.length > 0 && (
          <div className="pl-3 border-l border-slate-800/70 space-y-1.5">
            {node.children.map((child, i) => (
              <Branch key={i} node={child} depth={2} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative pl-4">
      <span className="absolute left-0 top-2.5 w-3 h-px bg-slate-800/70" />
      <p className="text-xs text-slate-400 leading-relaxed py-0.5">{node.label}</p>
    </div>
  );
};

const ConceptTree = ({ tree }) => {
  if (!tree || tree.children.length === 0) return null;
  return (
    <div className="overflow-x-auto py-2">
      <Branch node={tree} />
    </div>
  );
};

export default ConceptTree;
