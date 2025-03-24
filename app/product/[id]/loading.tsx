export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 