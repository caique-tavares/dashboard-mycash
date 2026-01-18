import { useState, useRef, useEffect } from 'react';
import { useFilters, TransactionTypeFilter } from '../../contexts/FilterContext';
import { FiltersMobileModal } from '../modals/FiltersMobileModal';

export const FilterButton = () => {
  const { transactionType, setTransactionType } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTypeChange = (type: TransactionTypeFilter) => {
    setTransactionType(type);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const FilterContent = () => (
    <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-stroke-4 min-w-[200px]">
      <h3 className="text-label-sm font-semibold text-secondary-900 mb-3">
        Tipo de Transação
      </h3>
      <div className="space-y-2">
        {(['all', 'income', 'expense'] as TransactionTypeFilter[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-paragraph-sm font-medium transition-colors ${
              transactionType === type
                ? 'bg-secondary-900 text-surface-500'
                : 'bg-gray-50 text-secondary-900 hover:bg-gray-100'
            }`}
          >
            {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gray-50 border border-stroke-4 flex items-center justify-center btn-hover flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Abrir filtros"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-5 h-5 text-secondary-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Desktop: Popover */}
      {!isMobile && isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50">
          <div ref={popoverRef}>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Mobile: Modal Completo de Filtros */}
      {isMobile && (
        <FiltersMobileModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
