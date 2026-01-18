import { useState, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';

export const SearchInput = () => {
  const { searchText, setSearchText } = useFilters();
  const [localValue, setLocalValue] = useState(searchText);

  // Debounce para atualizar o contexto após 300ms sem digitação
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, setSearchText]);

  return (
    <div className="relative flex-1 lg:flex-initial lg:w-64">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Pesquisar..."
        className="w-full pl-12 pr-4 py-2.5 lg:py-2 bg-gray-50 border border-stroke-4 rounded-full text-paragraph-sm text-secondary-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
    </div>
  );
};
