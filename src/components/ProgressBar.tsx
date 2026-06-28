interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({ current, total, showLabel = true, animated = true }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>${current.toLocaleString()}</span>
          <span>${total.toLocaleString()}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-center text-sm text-blue-600 font-medium mt-1">
          {percentage.toFixed(1)}% funded
        </div>
      )}
    </div>
  );
}