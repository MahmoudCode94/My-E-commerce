export default function Loading() {
  return (
    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10 px-6 md:px-20">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-120 bg-slate-50 animate-pulse rounded-xl border border-slate-100">
          <div className="h-52 bg-slate-200/50 m-4 rounded-lg"></div>
          <div className="h-6 bg-slate-200/50 mx-4 w-3/4 mb-3"></div>
          <div className="h-10 bg-slate-200/50 mt-auto m-4 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}