const stats = [
  {
    number: "6+",
    title: "AI Features",
    desc: "Everything you need in one platform.",
  },
  {
    number: "100%",
    title: "Free",
    desc: "Built for students without subscriptions.",
  },
  {
    number: "24/7",
    title: "Available",
    desc: "Study whenever you want.",
  },
  {
    number: "AI",
    title: "Powered",
    desc: "Groq Llama 3.3 for lightning-fast responses.",
  },
];

const WhyChoose = () => {
  return (
    <section className="bg-slate-900 py-24 mt-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="text-indigo-400 font-semibold">
            WHY STUDYHUB AI
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Study Smarter, Finish Faster
          </h2>

          <p className="text-slate-400 mt-6 text-lg">
            Everything a student needs in one AI-powered platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item) => (

            <div
              key={item.title}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center hover:border-indigo-500/50 transition duration-300"
            >

              <h3 className="text-5xl font-bold text-indigo-500">
                {item.number}
              </h3>

              <h4 className="text-2xl font-semibold mt-6">
                {item.title}
              </h4>

              <p className="text-slate-400 mt-4">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;