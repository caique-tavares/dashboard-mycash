import { useState, useMemo } from 'react';
import { useFinancial } from '../contexts/FinancialContext';
import { useFilters } from '../contexts/FilterContext';
import { formatCurrency } from '../utils/currency.utils';
import { mockFamilyMembers } from '../data/mockFamilyMembers';
import { NewTransactionModal } from '../components/modals/NewTransactionModal';
import { CreditCardsWidget } from '../components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../components/dashboard/UpcomingExpensesWidget';

export const Transactions = () => {
  const { transactions, bankAccounts, creditCards } = useFinancial();
  const { searchText, transactionType, dateRange, memberId } = useFilters();

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Filtros locais da view
  const [localSearch, setLocalSearch] = useState('');
  const [localCategoryFilter, setLocalCategoryFilter] = useState('all');
  const [localAccountFilter, setLocalAccountFilter] = useState('all');
  const [localMemberFilter, setLocalMemberFilter] = useState('all');
  const [localStatusFilter, setLocalStatusFilter] = useState('all');

  // Ordenação
  const [sortField, setSortField] = useState<'date' | 'description' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Paginação expandida
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Obter todas as categorias únicas
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    transactions.forEach(t => categories.add(t.category));
    return Array.from(categories).sort();
  }, [transactions]);

  // Filtragem avançada combinada
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

    // Filtros locais da view
    if (localSearch) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(localSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(localSearch.toLowerCase())
      );
    }

    if (localCategoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === localCategoryFilter);
    }

    if (localAccountFilter !== 'all') {
      if (localAccountFilter.startsWith('bank-')) {
        filtered = filtered.filter(t => t.bankAccountId === localAccountFilter);
      } else if (localAccountFilter.startsWith('card-')) {
        filtered = filtered.filter(t => t.creditCardId === localAccountFilter);
      }
    }

    if (localMemberFilter !== 'all') {
      filtered = filtered.filter(t => t.memberId === localMemberFilter);
    }

    if (localStatusFilter !== 'all') {
      filtered = filtered.filter(t => t.isPaid === (localStatusFilter === 'completed'));
    } else {
      // Para status 'all', mostrar todas as transações
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'date':
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    transactions,
    memberId,
    dateRange,
    transactionType,
    searchText,
    localSearch,
    localCategoryFilter,
    localAccountFilter,
    localMemberFilter,
    localStatusFilter,
    sortField,
    sortOrder
  ]);

  // Estatísticas
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const difference = income - expenses;

    return {
      income,
      expenses,
      difference,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Função de ordenação
  const handleSort = (field: 'date' | 'description' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Reset de página quando filtros mudam
  const resetFilters = () => {
    setLocalSearch('');
    setLocalCategoryFilter('all');
    setLocalAccountFilter('all');
    setLocalMemberFilter('all');
    setLocalStatusFilter('all');
    setCurrentPage(1);
  };

  // Exportar CSV
  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date.toLocaleDateString('pt-BR'),
        `"${t.description}"`,
        t.category,
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.amount.toString().replace('.', ','),
        t.isPaid ? 'Pago' : 'Pendente'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getAccountName = (bankAccountId?: string, creditCardId?: string) => {
    if (bankAccountId) {
      const account = bankAccounts.find(a => a.id === bankAccountId);
      return account ? `${account.name} (Conta)` : 'Conta Desconhecida';
    }
    if (creditCardId) {
      const card = creditCards.find(c => c.id === creditCardId);
      return card ? `${card.name} (Cartão)` : 'Cartão Desconhecido';
    }
    return 'Desconhecido';
  };

  const getMemberName = (memberId?: string) => {
    if (!memberId) return 'Família';
    const member = mockFamilyMembers.find(m => m.id === memberId);
    return member ? member.name : 'Desconhecido';
  };

  const SortIcon = ({ field }: { field: 'date' | 'description' | 'amount' }) => (
    <svg
      className={`w-4 h-4 ml-1 transition-transform ${
        sortField === field ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-gray-400'
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-md font-bold text-secondary-900">Transações</h1>
          <p className="text-paragraph-sm text-gray-600 mt-1">
            Visualize e gerencie todas as suas transações financeiras
          </p>
        </div>
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="bg-secondary-900 text-surface-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Transação
        </button>
      </div>

      {/* Filtros Avançados */}
      <div className="bg-surface-500 rounded-xl p-6 mb-6 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Busca */}
          <div className="xl:col-span-2">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar por descrição ou categoria..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Tipo
            </label>
            <select
              value={localStatusFilter}
              onChange={(e) => setLocalStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos</option>
              <option value="completed">Pago</option>
              <option value="pending">Pendente</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Categoria
            </label>
            <select
              value={localCategoryFilter}
              onChange={(e) => setLocalCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todas</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Conta/Cartão */}
          <div>
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Conta/Cartão
            </label>
            <select
              value={localAccountFilter}
              onChange={(e) => setLocalAccountFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todas</option>
              <optgroup label="Contas Bancárias">
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </optgroup>
              <optgroup label="Cartões de Crédito">
                {creditCards.map(card => (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Membro */}
          <div>
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Membro
            </label>
            <select
              value={localMemberFilter}
              onChange={(e) => setLocalMemberFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos</option>
              {mockFamilyMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          {/* Ações */}
          <div className="flex items-end gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 h-10 px-3 rounded-lg border border-stroke-4 text-secondary-900 hover:bg-gray-50 transition-colors text-paragraph-sm"
            >
              Limpar
            </button>
            <button
              onClick={exportToCSV}
              className="flex-1 h-10 px-3 rounded-lg bg-primary-500 text-secondary-900 hover:bg-primary-400 transition-colors text-paragraph-sm font-medium"
            >
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-paragraph-sm text-green-700 mb-1">Receitas</p>
          <p className="text-heading-sm font-bold text-green-800">
            {formatCurrency(stats.income)}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-paragraph-sm text-red-700 mb-1">Despesas</p>
          <p className="text-heading-sm font-bold text-red-800">
            {formatCurrency(stats.expenses)}
          </p>
        </div>
        <div className={`border rounded-lg p-4 ${stats.difference >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-paragraph-sm mb-1 ${stats.difference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            Saldo
          </p>
          <p className={`text-heading-sm font-bold ${stats.difference >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            {formatCurrency(stats.difference)}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-paragraph-sm text-blue-700 mb-1">Transações</p>
          <p className="text-heading-sm font-bold text-blue-800">
            {stats.count}
          </p>
        </div>
      </div>

      {/* Tabela Expandida */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma transação encontrada</h3>
          <p className="text-gray-600 mb-6">
            {transactions.length === 0
              ? "Você ainda não registrou nenhuma transação."
              : "Tente ajustar os filtros para ver mais resultados."
            }
          </p>
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-secondary-900 text-surface-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Primeira Transação
          </button>
        </div>
      ) : (
        <>
          <div className="bg-surface-500 rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke-4 bg-gray-50">
                    <th
                      className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Data
                        <SortIcon field="date" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('description')}
                    >
                      <div className="flex items-center">
                        Descrição
                        <SortIcon field="description" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600">
                      Categoria
                    </th>
                    <th className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600">
                      Conta/Cartão
                    </th>
                    <th className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600">
                      Membro
                    </th>
                    <th className="text-left py-3 px-4 text-paragraph-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th
                      className="text-right py-3 px-4 text-paragraph-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        Valor
                        <SortIcon field="amount" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-paragraph-sm text-gray-600">
                        {transaction.date.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4 text-paragraph-sm font-medium text-secondary-900">
                        {transaction.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-paragraph-sm text-gray-600">
                        {getAccountName(transaction.bankAccountId, transaction.creditCardId)}
                      </td>
                      <td className="py-4 px-4 text-paragraph-sm text-gray-600">
                        {getMemberName(transaction.memberId)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.isPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className={`py-4 px-4 text-right text-paragraph-sm font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-paragraph-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length} transações
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-stroke-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-paragraph-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-stroke-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Widgets em telas menores que xl - aparecem abaixo da tabela */}
      <div className="lg:hidden mt-8 space-y-6">
        <CreditCardsWidget />
        <UpcomingExpensesWidget />
      </div>

      {/* Modal de Nova Transação */}
      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
};