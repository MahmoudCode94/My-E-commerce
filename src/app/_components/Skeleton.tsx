import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] p-4 flex flex-row md:flex-col gap-4 h-36 md:h-[400px]">
      <Skeleton className="w-1/3 shrink-0 md:w-full h-28 md:h-52 rounded-2xl" />
      <div className="flex-1 flex flex-col justify-between py-2 md:py-0">
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="hidden md:flex gap-2 mt-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BrandOrCategorySkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Banner Skeleton */}
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <Skeleton className="w-24 h-24 rounded-full md:w-32 md:h-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="flex items-center justify-center px-6 py-10 lg:px-20 min-h-[80vh]">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Carousel/Image Skeleton */}
        <div className="flex items-center justify-center">
          <Skeleton className="w-full max-w-[450px] aspect-square rounded-[2rem]" />
        </div>

        {/* Right Side: Text & Detail Skeleton */}
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-full space-y-4">
            <Skeleton className="h-10 md:h-14 w-5/6" />
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-2 max-w-xl">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start w-full gap-4">
            <Skeleton className="h-12 w-32" />
            <div className="flex w-full max-w-md gap-4">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
