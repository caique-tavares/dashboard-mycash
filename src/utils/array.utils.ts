import { Transaction } from '../types';

/**
 * Utilitários para manipulação de arrays e objetos
 */

/**
 * Agrupa transações por categoria e soma os valores
 * @param transactions - Array de transações a serem agrupadas
 * @returns Objeto com categorias como chaves e valores somados
 * @example
 * groupByCategory(transactions) // { "Alimentação": 1500, "Transporte": 800 }
 */
export const groupByCategory = (transactions: Transaction[]): Record<string, number> => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category;
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;

    groups[category] = (groups[category] || 0) + amount;
    return groups;
  }, {} as Record<string, number>);
};

/**
 * Filtra transações por intervalo de datas
 * @param transactions - Array de transações a serem filtradas
 * @param dateRange - Objeto com startDate e endDate
 * @returns Array de transações dentro do intervalo
 * @example
 * filterByDateRange(transactions, { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') })
 */
export const filterByDateRange = (
  transactions: Transaction[],
  dateRange: { startDate?: Date; endDate?: Date }
): Transaction[] => {
  if (!dateRange.startDate || !dateRange.endDate) {
    return transactions;
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= dateRange.startDate! && transactionDate <= dateRange.endDate!;
  });
};

/**
 * Ordena array de transações por data
 * @param transactions - Array de transações a serem ordenadas
 * @param order - Ordem: 'asc' para crescente, 'desc' para decrescente
 * @returns Array de transações ordenado
 * @example
 * sortByDate(transactions, 'desc') // Mais recentes primeiro
 */
export const sortByDate = (transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Ordena array de transações por valor
 * @param transactions - Array de transações a serem ordenadas
 * @param order - Ordem: 'asc' para crescente, 'desc' para decrescente
 * @returns Array de transações ordenado por valor absoluto
 * @example
 * sortByAmount(transactions, 'desc') // Maiores valores primeiro
 */
export const sortByAmount = (transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] => {
  return [...transactions].sort((a, b) => {
    return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
  });
};

/**
 * Remove duplicatas de um array baseado em uma propriedade
 * @param array - Array de objetos
 * @param property - Propriedade para verificar duplicatas
 * @returns Array sem duplicatas
 * @example
 * removeDuplicates(transactions, 'id') // Remove transações com mesmo ID
 */
export const removeDuplicates = <T>(array: T[], property: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[property];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Pagina um array de itens
 * @param array - Array a ser paginado
 * @param page - Número da página (começando em 1)
 * @param pageSize - Número de itens por página
 * @returns Objeto com itens da página e informações de paginação
 * @example
 * paginate(transactions, 1, 10) // { items: [...], total: 50, page: 1, totalPages: 5 }
 */
export const paginate = <T>(
  array: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; page: number; totalPages: number; hasNext: boolean; hasPrev: boolean } => {
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};