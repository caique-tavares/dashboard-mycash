import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  duration?: number;
  color?: string;
  height?: string;
  className?: string;
}

export const AnimatedProgressBar = ({
  value,
  max = 100,
  duration = 1000,
  color = '#D7FF00',
  height = 'h-3',
  className = ''
}: AnimatedProgressBarProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedValue(value);
      return;
    }

    const startValue = animatedValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, prefersReducedMotion]);

  const percentage = Math.min((animatedValue / max) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} ${className}`}>
      <div
        className="rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          height: '100%'
        }}
      />
    </div>
  );
};