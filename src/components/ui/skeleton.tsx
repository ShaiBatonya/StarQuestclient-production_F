import { cn } from '@/lib/utils';

// Base skeleton component
export const Skeleton = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "loading-shimmer-dark rounded animate-pulse",
        className
      )}
      {...props}
    />
  );
};

// Skeleton variants for different content types
export const SkeletonText = ({ 
  lines = 1, 
  className,
  lastLineWidth = '75%'
}: { 
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          "h-4",
          index === lines - 1 ? `w-[${lastLineWidth}]` : "w-full"
        )}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("gaming-card rounded-lg p-6 space-y-4", className)}>
    <div className="flex items-center space-x-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  </div>
);

export const SkeletonTable = ({ 
  rows = 5, 
  columns = 4,
  className 
}: { 
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    {/* Header */}
    <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} className="h-4 w-3/4" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={`cell-${rowIndex}-${colIndex}`} 
            className={cn(
              "h-4",
              colIndex === 0 ? "w-full" : colIndex === 1 ? "w-2/3" : "w-1/2"
            )} 
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  return (
    <Skeleton 
      className={cn(
        "rounded-full",
        sizeClasses[size],
        className
      )} 
    />
  );
};

export const SkeletonButton = ({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton 
      className={cn(
        "rounded-md",
        sizeClasses[size],
        className
      )} 
    />
  );
};

export const SkeletonChart = ({ className }: { className?: string }) => (
  <div className={cn("gaming-card rounded-lg p-6 space-y-4", className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-end space-x-2">
          <Skeleton 
            className="w-8 rounded-t-sm"
            style={{ 
              height: `${Math.random() * 60 + 20}px` 
            }}
          />
          <Skeleton 
            className="w-8 rounded-t-sm"
            style={{ 
              height: `${Math.random() * 80 + 10}px` 
            }}
          />
          <Skeleton 
            className="w-8 rounded-t-sm"
            style={{ 
              height: `${Math.random() * 50 + 30}px` 
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonList = ({ 
  items = 5,
  showAvatar = true,
  className 
}: { 
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
        {showAvatar && <SkeletonAvatar size="sm" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ 
  columns = 3,
  rows = 2,
  className 
}: { 
  columns?: number;
  rows?: number;
  className?: string;
}) => (
  <div className={cn(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`, className)}>
    {Array.from({ length: columns * rows }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const SkeletonStats = ({ className }: { className?: string }) => (
  <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="gaming-card rounded-lg p-4 text-center space-y-2">
        <Skeleton className="h-8 w-16 mx-auto" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ 
  fields = 4,
  className 
}: { 
  fields?: number;
  className?: string;
}) => (
  <div className={cn("space-y-6", className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <div className="flex space-x-4 pt-4">
      <SkeletonButton size="lg" className="flex-1" />
      <SkeletonButton size="lg" />
    </div>
  </div>
);

// Pulse loading indicator for inline loading
export const PulseLoader = ({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-full bg-gaming-primary animate-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Shimmer effect for content loading
export const ShimmerBox = ({ 
  width = '100%',
  height = '100px',
  className 
}: { 
  width?: string;
  height?: string;
  className?: string;
}) => (
  <div 
    className={cn("loading-shimmer-dark rounded-lg", className)}
    style={{ width, height }}
  />
); 