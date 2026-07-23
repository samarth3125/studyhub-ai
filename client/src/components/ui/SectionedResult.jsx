import {
  BookOpen,
  ListChecks,
  Lightbulb,
  BookMarked,
  GraduationCap,
  Network,
  Info,
  FileText,
} from "lucide-react";
import Markdown from "./Markdown";

const iconFor = (title) => {
  const t = title.toLowerCase();
  if (t.includes("definition")) return BookOpen;
  if (t.includes("key point")) return ListChecks;
  if (t.includes("example")) return Lightbulb;
  if (t.includes("mnemonic")) return BookMarked;
  if (t.includes("analog")) return Lightbulb;
  if (t.includes("exam")) return GraduationCap;
  if (t.includes("related")) return Network;
  if (t.includes("overview")) return Info;
  return FileText;
};

const SectionedResult = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        const Icon = iconFor(section.title);
        return (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-300 mb-2">
              <Icon size={15} />
              {section.title}
            </h3>
            <Markdown>{section.content}</Markdown>
          </div>
        );
      })}
    </div>
  );
};

export default SectionedResult;
