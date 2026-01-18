import { useState } from 'react';
import { useFinancial } from '../../contexts/FinancialContext';
import { formatCurrency } from '../../utils/currency.utils';
import { AnimatedProgressBar } from '../ui/AnimatedProgressBar';
import { CreditCard, Transaction } from '../../types';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
}

export const CardDetailsModal = ({ isOpen, onClose, card }: CardDetailsModalProps) => {
  const { transactions } = useFinancial();
  const [currentPage, setCurrentPage] = useState(0);
  const expensesPerPage = 10;

  if (!isOpen || !card) return null;

  // Filtrar transações do cartão
  const cardTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.type === 'expense' &&
      transaction.creditCardId === card.id
  );

  // Calcular estatísticas
  const totalLimit = card.limit;
  const usedLimit = card.usedLimit;
  const availableLimit = totalLimit - usedLimit;
  const usagePercentage = Math.round((usedLimit / totalLimit) * 1000) / 10; // Uma casa decimal

  // Paginação
  const totalPages = Math.ceil(cardTransactions.length / expensesPerPage);
  const startIndex = currentPage * expensesPerPage;
  const visibleTransactions = cardTransactions
    .slice(startIndex, startIndex + expensesPerPage)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface-500 rounded-xl md:rounded-2xl shadow-card w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-stroke-4">
          <h2 className="text-2xl font-bold text-secondary-900">{card.name}</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Informações do Cartão */}
          <div className="p-6 border-b border-stroke-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informações do Cartão</h3>

            {/* Grid de informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Limite Total</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  {formatCurrency(totalLimit)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Fatura Atual</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  {formatCurrency(usedLimit)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Limite Disponível</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  {formatCurrency(availableLimit)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Percentual de Uso</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  {usagePercentage}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Dia de Fechamento</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  Dia {card.closingDate}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-paragraph-sm text-gray-600 mb-1">Dia de Vencimento</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  Dia {card.dueDate}
                </p>
              </div>
            </div>

            {/* Últimos 4 dígitos */}
            {card.lastFourDigits && (
              <div className="bg-gray-50 rounded-lg p-4 inline-block">
                <p className="text-paragraph-sm text-gray-600 mb-1">Últimos 4 Dígitos</p>
                <p className="text-heading-sm font-bold text-secondary-900">
                  •••• {card.lastFourDigits}
                </p>
              </div>
            )}

            {/* Barra de progresso visual */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uso do Limite</span>
                <span>{usagePercentage}%</span>
              </div>
              <AnimatedProgressBar
                value={usagePercentage}
                max={100}
                color="#D7FF00"
                height="h-3"
              />
            </div>
          </div>

          {/* Despesas do Cartão */}
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Despesas do Cartão ({cardTransactions.length})
            </h3>

            {cardTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-paragraph-lg text-gray-500">
                  Nenhuma despesa registrada neste cartão ainda.
                </p>
              </div>
            ) : (
              <>
                {/* Tabela */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke-4">
                        <th className="text-left py-2 px-4 text-paragraph-sm font-medium text-gray-600">
                          Data
                        </th>
                        <th className="text-left py-2 px-4 text-paragraph-sm font-medium text-gray-600">
                          Descrição
                        </th>
                        <th className="text-left py-2 px-4 text-paragraph-sm font-medium text-gray-600">
                          Categoria
                        </th>
                        <th className="text-left py-2 px-4 text-paragraph-sm font-medium text-gray-600">
                          Parcelas
                        </th>
                        <th className="text-right py-2 px-4 text-paragraph-sm font-medium text-gray-600">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTransactions.map((transaction: Transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-paragraph-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-paragraph-sm font-medium text-secondary-900">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-paragraph-sm text-gray-600">
                            {transaction.installments}x
                          </td>
                          <td className="py-3 px-4 text-right text-paragraph-sm font-bold text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-paragraph-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(startIndex + expensesPerPage, cardTransactions.length)} de {cardTransactions.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="px-3 py-1 border border-stroke-4 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-1 text-paragraph-sm">
                        Página {currentPage + 1} de {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1 border border-stroke-4 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer com ações */}
        <div className="p-4 md:p-6 border-t border-stroke-4 bg-surface-500">
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => {
                // TODO: Navegar para extrato completo com filtro do cartão
                console.log('Ver extrato completo do cartão:', card.id);
              }}
              className="px-4 py-2 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors"
            >
              Ver Extrato Completo
            </button>
            <button
              onClick={() => {
                // TODO: Abrir modal de nova transação com cartão pré-selecionado
                console.log('Adicionar despesa no cartão:', card.id);
              }}
              className="px-4 py-2 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors"
            >
              Adicionar Despesa
            </button>
            <button
              onClick={() => {
                // TODO: Abrir modal de edição do cartão
                console.log('Editar cartão:', card.id);
              }}
              className="px-4 py-2 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors"
            >
              Editar Cartão
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary-900 text-surface-500 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};