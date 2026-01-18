import { useState, useMemo } from 'react';
import { useFinancial } from '../../contexts/FinancialContext';
import { useFilters } from '../../contexts/FilterContext';
import { formatCurrency } from '../../utils/currency.utils';
import { formatDate } from '../../utils/date.utils';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';
import { Transaction } from '../../types/Transaction';

export const TransactionsTable = () => {
  const { transactions, bankAccounts, creditCards } = useFinancial();
  const { searchText, transactionType, dateRange, memberId } = useFilters();

  const [localSearch, setLocalSearch] = useState('');
  const [localTypeFilter, setLocalTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtragem combinada
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtros globais do contexto
    if (memberId) {
      filtered = filtered.filter(t => t.memberId === memberId);
    }

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(t =>
        t.date >= dateRange.startDate! && t.date <= dateRange.endDate!
      );
    }

    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }

    if (searchText) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchText.toLowerCase()) ||
        t.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtros locais da tabela
    if (localSearch) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(localSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(localSearch.toLowerCase())
      );
    }

    if (localTypeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === localTypeFilter);
    }

    // Ordenação por data decrescente
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, memberId, dateRange, transactionType, searchText, localSearch, localTypeFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const findMember = (transaction: Transaction) => {
    return mockFamilyMembers.find(m => m.id === transaction.memberId) || mockFamilyMembers[0];
  };

  const getAccountName = (bankAccountId?: string, creditCardId?: string) => {
    if (bankAccountId) {
      const account = bankAccounts.find(a => a.id === bankAccountId);
      return account ? account.name : 'Conta Desconhecida';
    }
    if (creditCardId) {
      const card = creditCards.find(c => c.id === creditCardId);
      return card ? card.name : 'Cartão Desconhecido';
    }
    return 'Desconhecido';
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="bg-surface-500 border border-stroke-4 rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h3 className="text-heading-md font-bold text-secondary-900">Extrato Detalhado</h3>

        {/* Controles de filtro */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo de busca */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
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
              placeholder="Buscar lançamentos..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full lg:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-stroke-4 rounded-lg text-paragraph-sm text-secondary-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Select de tipo */}
          <select
            value={localTypeFilter}
            onChange={(e) => {
              setLocalTypeFilter(e.target.value as 'all' | 'income' | 'expense');
              setCurrentPage(1);
            }}
            className="w-full lg:w-36 px-3 py-2 bg-gray-50 border border-stroke-4 rounded-lg text-paragraph-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="border border-stroke-4 rounded-xl overflow-hidden">
        <table className="w-full">
          {/* Header da tabela */}
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Avatar</th>
              <th className="px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Data</th>
              <th className="px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Descrição</th>
              <th className="px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Categoria</th>
              <th className="px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Conta/Cartão</th>
              <th className="px-4 py-3 text-left text-paragraph-xs font-semibold text-gray-600">Parcelas</th>
              <th className="px-4 py-3 text-right text-paragraph-xs font-semibold text-gray-600">Valor</th>
            </tr>
          </thead>

          {/* Corpo da tabela */}
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => {
                const isEven = index % 2 === 0;
                const transactionMember = findMember(transaction);
                return (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-gray-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-25'}`}
                  >
                    {/* Avatar */}
                    <td className="px-4 py-3">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-paragraph-xs font-bold text-secondary-900">
                          {transactionMember.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* Data */}
                    <td className="px-4 py-3 text-paragraph-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </td>

                    {/* Descrição */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <svg
                            className={`w-3 h-3 ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={transaction.type === 'income'
                                ? "M19 14l-7 7m0 0l-7-7m7 7V3"
                                : "M5 10l7-7m0 0l7 7m-7-7v18"
                              }
                            />
                          </svg>
                        </div>
                        <span className="text-paragraph-sm font-semibold text-secondary-900">
                          {transaction.description}
                        </span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-paragraph-xs rounded-full">
                        {transaction.category}
                      </span>
                    </td>

                    {/* Conta/Cartão */}
                    <td className="px-4 py-3 text-paragraph-sm text-gray-600">
                      {getAccountName(transaction.bankAccountId, transaction.creditCardId)}
                    </td>

                    {/* Parcelas */}
                    <td className="px-4 py-3 text-paragraph-sm text-gray-600">
                      {transaction.installments}x
                    </td>

                    {/* Valor */}
                    <td className={`px-4 py-3 text-right text-paragraph-sm font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-paragraph-sm text-gray-500">
                    Nenhum lançamento encontrado.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Contador */}
          <p className="text-paragraph-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length}
          </p>

          {/* Controles */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-paragraph-sm border border-stroke-4 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Anterior
            </button>

            <span className="px-3 py-1 text-paragraph-sm">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-paragraph-sm border border-stroke-4 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};