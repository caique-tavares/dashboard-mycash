import { useState } from 'react';
import { SearchInput } from './SearchInput';
import { FilterButton } from './FilterButton';
import { DateRangePicker } from './DateRangePicker';
import { FamilyMembersWidget } from './FamilyMembersWidget';
import { NewTransactionModal } from '../modals/NewTransactionModal';

export const DashboardHeader = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-surface-500 rounded-md p-4 lg:p-6 mb-6 lg:mb-8 shadow-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
          {/* Esquerda: Busca e Filtros */}
          <div className="flex-1 flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
            <SearchInput />
            <FilterButton />
            <DateRangePicker />
          </div>

          {/* Centro: Membros da Família */}
          <div className="flex items-center gap-3 lg:gap-4">
            <FamilyMembersWidget />
          </div>

          {/* Direita: Nova Transação */}
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="w-full lg:w-auto bg-secondary-900 text-surface-500 px-6 py-3 lg:py-2.5 rounded-full font-semibold text-label-sm btn-hover flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Adicionar nova transação"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Nova Transação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Nova Transação */}
      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
};
