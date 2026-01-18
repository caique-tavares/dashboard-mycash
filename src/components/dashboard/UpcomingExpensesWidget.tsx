import { useState } from 'react';
import { formatCurrency } from '../../utils/currency.utils';
import { AddAccountModal } from '../modals/AddAccountModal';

// Dados mock para próximas despesas
const mockUpcomingExpenses = [
  {
    id: '1',
    description: 'Aluguel',
    amount: 1500,
    dueDate: new Date(2026, 0, 10),
    accountType: 'bank',
    accountName: 'Nubank conta',
    isPaid: false,
    isRecurring: true,
  },
  {
    id: '2',
    description: 'Internet',
    amount: 89.90,
    dueDate: new Date(2026, 0, 12),
    accountType: 'bank',
    accountName: 'Inter conta',
    isPaid: false,
    isRecurring: true,
  },
  {
    id: '3',
    description: 'Cartão de Crédito',
    amount: 1200.50,
    dueDate: new Date(2026, 0, 15),
    accountType: 'credit',
    accountName: 'Nubank **** 5897',
    isPaid: false,
    isRecurring: true,
  },
  {
    id: '4',
    description: 'Academia',
    amount: 120.00,
    dueDate: new Date(2026, 0, 18),
    accountType: 'bank',
    accountName: 'C6 Bank conta',
    isPaid: false,
    isRecurring: true,
  },
];

export const UpcomingExpensesWidget = () => {
  const [expenses, setExpenses] = useState(mockUpcomingExpenses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const formatDueDate = (date: Date) => {
    return `Vence dia ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatAccountName = (type: string, name: string) => {
    if (type === 'bank') {
      return name;
    }
    return `Crédito ${name}`;
  };

  const handleMarkAsPaid = (expenseId: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === expenseId
          ? { ...expense, isPaid: true }
          : expense
      )
    );

    // Animação e feedback
    setTimeout(() => {
      setExpenses(prevExpenses =>
        prevExpenses.filter(expense => expense.id !== expenseId)
      );
      // Aqui seria a lógica para criar próxima ocorrência se recorrente
    }, 500);
  };

  const unpaidExpenses = expenses.filter(expense => !expense.isPaid)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <>
      <div className="bg-surface-500 border border-stroke-4 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-heading-sm font-bold text-secondary-900">Próximas despesas</h3>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 bg-surface-500 border border-stroke-4 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Adicionar despesa"
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

        {/* Lista de Despesas */}
        {unpaidExpenses.length > 0 ? (
          <div className="space-y-4">
            {unpaidExpenses.map((expense, index) => (
              <div key={expense.id}>
                <div className="flex items-center justify-between py-4">
                  {/* Informações à esquerda */}
                  <div className="flex-1">
                    <p className="text-paragraph-sm font-semibold text-secondary-900 mb-1">
                      {expense.description}
                    </p>
                    <p className="text-paragraph-xs text-gray-600 mb-1">
                      {formatDueDate(expense.dueDate)}
                    </p>
                    <p className="text-paragraph-xs text-gray-400">
                      {formatAccountName(expense.accountType, expense.accountName)}
                    </p>
                  </div>

                  {/* Valor e botão à direita */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-heading-sm font-bold text-secondary-900">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMarkAsPaid(expense.id)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 bg-transparent flex items-center justify-center hover:bg-green-50 hover:border-green-500 transition-all duration-200 group"
                      aria-label="Marcar como pago"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Linha divisória */}
                {index < unpaidExpenses.length - 1 && (
                  <div className="border-b border-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-paragraph-sm text-gray-500 text-center">
              Nenhuma despesa pendente
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar conta/cartão */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};