import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentChildren, setCurrentChildren] = useState<ReactNode>(children);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentChildren(children);
      return;
    }

    // Fade out
    setIsVisible(false);

    const fadeOutTimer = setTimeout(() => {
      setCurrentChildren(children);
      setIsVisible(true);
    }, 200); // Tempo do fade-out

    return () => clearTimeout(fadeOutTimer);
  }, [location.pathname, children, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {currentChildren}
    </div>
  );
};