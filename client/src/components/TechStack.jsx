const tech = [
  {
    icon: "⚛️",
    name: "React",
    desc: "Modern Frontend",
  },
  {
    icon: "🟢",
    name: "Node.js",
    desc: "Backend Runtime",
  },
  {
    icon: "🚂",
    name: "Express",
    desc: "REST API",
  },
  {
    icon: "🍃",
    name: "MongoDB",
    desc: "NoSQL Database",
  },
  {
    icon: "🤖",
    name: "Groq AI",
    desc: "Llama 3.3 AI",
  },
  {
    icon: "🎨",
    name: "Tailwind CSS",
    desc: "Modern Styling",
  },
];

const TechStack = () => {
  return (
    <section
      id="tech"
      className="max-w-7xl mx-auto px-8 py-24"
    >
      <div className="text-center">

        <p className="text-indigo-400 font-semibold">
          BUILT WITH
        </p>

        <h2 className="text-5xl font-bold mt-4">
          Modern Tech Stack
        </h2>

        <p className="text-slate-400 mt-6 text-lg">
          Built using today's most powerful technologies.
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">

        {tech.map((item) => (

          <div
            key={item.name}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm p-8 text-center hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-300"
          >

            <div className="text-5xl mb-5">
              {item.icon}
            </div>

            <h3 className="font-bold text-xl">
              {item.name}
            </h3>

            <p className="text-slate-400 mt-3 text-sm">
              {item.desc}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
};

export default TechStack;