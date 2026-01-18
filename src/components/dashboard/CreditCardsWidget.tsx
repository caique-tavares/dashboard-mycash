import { useState } from 'react';
import { useFinancial } from '../../contexts/FinancialContext';
import { formatCurrency } from '../../utils/currency.utils';
import { AddAccountModal } from '../modals/AddAccountModal';
import { CardDetailsModal } from '../modals/CardDetailsModal';

export const CreditCardsWidget = () => {
  const { creditCards } = useFinancial();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const cardsPerPage = 3;
  const totalPages = Math.ceil(creditCards.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const visibleCards = creditCards.slice(startIndex, startIndex + cardsPerPage);

  const getCardThemeColor = (color: string) => {
    switch (color) {
      case '#8A05BE':
        return 'bg-purple-500';
      case '#060A11':
        return 'bg-secondary-900';
      case '#FFFFFF':
        return 'bg-surface-500 border-2 border-stroke-4';
      default:
        return 'bg-gray-500';
    }
  };

  const getCardIconColor = (color: string) => {
    switch (color) {
      case '#8A05BE':
        return 'text-surface-500';
      case '#060A11':
        return 'text-surface-500';
      case '#FFFFFF':
        return 'text-secondary-900';
      default:
        return 'text-surface-500';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case '#8A05BE':
        return 'bg-purple-100 text-purple-900';
      case '#060A11':
        return 'bg-secondary-100 text-secondary-900';
      case '#FFFFFF':
        return 'bg-gray-100 text-secondary-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setIsDetailsModalOpen(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  return (
    <>
      <div className="bg-gray-50 border border-stroke-4 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-secondary-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="text-heading-sm font-medium text-secondary-900">Cartões</h3>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 bg-surface-500 border border-stroke-4 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Adicionar cartão"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Lista de Cartões */}
        <div className="space-y-4">
          {visibleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="bg-surface-500 border border-stroke-4 rounded-xl p-4 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Ícone do cartão */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCardThemeColor(card.color)}`}>
                  <svg
                    className={`w-6 h-6 ${getCardIconColor(card.color)}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>

                {/* Informações do cartão */}
                <div className="flex-1">
                  <p className="text-paragraph-sm text-gray-600">{card.name}</p>
                  <p className="text-heading-sm font-bold text-secondary-900">
                    {formatCurrency(card.usedLimit)}
                  </p>
                  <p className="text-paragraph-xs text-gray-400">
                    •••• {card.lastFourDigits}
                  </p>
                </div>

                {/* Badge de uso */}
                <div className={`px-3 py-1 rounded-full text-paragraph-xs font-semibold ${getBadgeColor(card.color)}`}>
                  {getUsagePercentage(card.usedLimit, card.limit)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="w-8 h-8 rounded-full bg-surface-500 border border-stroke-4 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 text-secondary-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="w-8 h-8 rounded-full bg-surface-500 border border-stroke-4 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 text-secondary-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modal de adicionar conta/cartão */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Modal de detalhes do cartão */}
      <CardDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        card={selectedCard}
      />
    </>
  );
};