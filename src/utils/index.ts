/**
 * Utilitários do sistema - exports organizados
 */

// Utilitários de moeda
export {
  formatCurrency,
  formatCompactCurrency,
  parseCurrencyInput,
  formatCurrencyInput,
} from './currency.utils';

// Utilitários de data
export {
  formatDate,
  formatDateLong,
  formatDateRange,
  formatRelativeDate,
  parseDateString,
} from './date.utils';

// Utilitários de array
export {
  groupByCategory,
  filterByDateRange,
  sortByDate,
  sortByAmount,
  removeDuplicates,
  paginate,
} from './array.utils';

// Utilitários financeiros
export {
  calculatePercentage,
  calculateDifference,
  calculateInstallmentValue,
  calculateCompoundInterest,
  calculatePresentValue,
  calculateOutstandingBalance,
  calculateMonthlyPayment,
  formatPercentage,
} from './financial.utils';

// Utilitários de validação
export {
  isValidEmail,
  isValidCPF,
  isValidDate,
  isPositiveNumber,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isNumeric,
  isValidPhone,
  validatePassword,
} from './validation.utils';

// Utilitários de ID
export {
  generateUniqueId,
  generateTransactionId,
  generateAccountId,
  generateCardId,
  generateMemberId,
  generateGoalId,
  generateUUID,
  generateShortCode,
  generateReferenceCode,
} from './id.utils';

// Export de testes (opcional)
export { runUtilsTests } from './tests/utils.test';