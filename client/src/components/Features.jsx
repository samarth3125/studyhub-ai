import {
  NotebookPen,
  Sparkles,
  Brain,
  FileText,
  Layers,
  CalendarClock,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: NotebookPen,
    title: "Smart Notes",
    desc: "Create and organize your study notes with an elegant interface.",
  },
  {
    icon: Sparkles,
    title: "AI Summary",
    desc: "Convert long notes into concise, easy-to-revise summaries.",
  },
  {
    icon: Brain,
    title: "Quiz Generator",
    desc: "Generate AI-powered quizzes instantly from your notes.",
  },
  {
    icon: Layers,
    title: "Flashcards",
    desc: "Revise quickly using interactive AI-generated flashcards.",
  },
  {
    icon: FileText,
    title: "PDF Assistant",
    desc: "Upload PDFs and summarize them instantly with AI.",
  },
  {
    icon: CalendarClock,
    title: "Study Planner",
    desc: "Generate personalized study plans for your exams.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-8 py-24"
    >
      <div className="text-center mb-16">
        <p className="text-indigo-400 font-semibold">
          FEATURES
        </p>

        <h2 className="text-5xl font-bold mt-4">
          Everything You Need to Study Smarter
        </h2>

        <p className="text-gray-400 mt-6 text-lg">
          Powerful AI tools designed to make learning faster,
          easier, and more enjoyable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;