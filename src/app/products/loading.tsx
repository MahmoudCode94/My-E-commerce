export default function Loading() {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 px-10 md:px-20 mt-10">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-120 bg-slate-50 animate-pulse rounded-xl border border-slate-100 flex flex-col p-4">
           <div className="h-52 bg-slate-200/50 rounded-lg mb-4"></div>
           <div className="h-6 bg-slate-200/50 w-3/4 mb-2"></div>
           <div className="h-4 bg-slate-200/50 w-full mb-1"></div>
           <div className="h-10 bg-slate-200/50 mt-auto rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}