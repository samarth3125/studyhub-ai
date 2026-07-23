// Splits a markdown string into sections based on level-2 ("## Heading")
// headings. Falls back to a single "Response" section if no headings
// are found, so older/unstructured responses still render correctly.
export const parseSections = (markdown = "") => {
  if (!markdown.trim()) return [];

  const lines = markdown.split("\n");
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      // content before the first heading — collect into an
      // "Overview" bucket instead of dropping it.
      current = { title: "Overview", lines: [line] };
    }
  });

  if (current) sections.push(current);

  return sections
    .map((s) => ({ title: s.title, content: s.lines.join("\n").trim() }))
    .filter((s) => s.content);
};

// Pulls short bullet items out of a section's markdown content, used
// to build the hierarchical concept tree's leaf nodes.
const extractBullets = (content) => {
  return content
    .split("\n")
    .filter((l) => /^\s*[-*]\s+/.test(l))
    .map((l) => l.replace(/^\s*[-*]\s+/, "").replace(/\*\*/g, "").trim())
    .filter(Boolean)
    .slice(0, 6);
};

// Builds a simple two-level tree (concept -> sections -> bullet points)
// from the same section data, for the hierarchical concept-map view.
export const buildConceptTree = (concept, sections) => {
  return {
    label: concept,
    children: sections.map((s) => ({
      label: s.title,
      children: extractBullets(s.content).map((b) => ({ label: b, children: [] })),
    })),
  };
};
