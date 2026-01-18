import { useState, useEffect, useRef } from 'react';

/**
 * Hook para animar contagem de números de 0 até o valor final
 * @param targetValue - Valor final a ser alcançado
 * @param duration - Duração da animação em milissegundos (padrão: 800ms)
 * @returns Valor atual da animação
 */
export const useCountAnimation = (targetValue: number, duration: number = 800): number => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    // Cancela animação anterior se existir
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    if (targetValue === 0) {
      setCurrentValue(0);
      startValueRef.current = 0;
      return;
    }

    const startValue = currentValue;
    startValueRef.current = startValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = startValueRef.current + difference * easeOut;

      setCurrentValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
        startValueRef.current = targetValue;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return Math.round(currentValue * 100) / 100; // Arredonda para 2 casas decimais
};