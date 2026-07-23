import Spinner from "./Spinner";

const PageLoader = ({ label = "Loading..." }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-slate-400">
    <Spinner size={28} />
    <p className="text-sm">{label}</p>
  </div>
);

export default PageLoader;
