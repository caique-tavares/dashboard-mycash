interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height
}: SkeletonProps) => {
  const baseClasses = 'skeleton bg-gray-200';

  const variantClasses = {
    text: 'rounded h-4',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Componentes específicos para diferentes tipos de conteúdo
export const SkeletonText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        className={index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`bg-surface-500 rounded-xl p-6 shadow-card ${className}`}>
    <Skeleton variant="text" className="w-1/3 mb-4" />
    <Skeleton variant="rectangular" height={100} className="mb-4" />
    <div className="flex space-x-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton variant="text" className="w-2/3 mb-2" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }: {
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div className={`bg-surface-500 rounded-xl overflow-hidden ${className}`}>
    {/* Header */}
    <div className="p-4 border-b border-stroke-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" className="h-5" />
        ))}
      </div>
    </div>

    {/* Rows */}
    <div className="p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 mb-4 last:mb-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" className="h-4" />
          ))}
        </div>
      ))}
    </div>
  </div>
);