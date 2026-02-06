export default function LoadingProducts() {
    return (
        <div className="grid grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-20">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="border h-100 rounded-[2rem] border-slate-100 bg-slate-50 animate-pulse">
                    <div className="m-4 rounded-[1.5rem] h-52 bg-slate-200/50" />
                    <div className="w-3/4 h-6 mx-4 mb-3 rounded-md bg-slate-200/50" />
                    <div className="h-10 m-4 rounded-xl bg-slate-200/50" />
                </div>
            ))}
        </div>
    );
}