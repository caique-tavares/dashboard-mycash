import { createContext, useContext, useState, ReactNode } from 'react';

export type TransactionTypeFilter = 'all' | 'income' | 'expense';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterContextType {
  searchText: string;
  transactionType: TransactionTypeFilter;
  dateRange: DateRange;
  memberId: string | null;
  setSearchText: (text: string) => void;
  setTransactionType: (type: TransactionTypeFilter) => void;
  setDateRange: (range: DateRange) => void;
  setMemberId: (id: string | null) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [searchText, setSearchText] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionTypeFilter>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });
  const [memberId, setMemberId] = useState<string | null>(null);

  const clearFilters = () => {
    setSearchText('');
    setTransactionType('all');
    setDateRange({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
    });
    setMemberId(null);
  };

  return (
    <FilterContext.Provider
      value={{
        searchText,
        transactionType,
        dateRange,
        memberId,
        setSearchText,
        setTransactionType,
        setDateRange,
        setMemberId,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
