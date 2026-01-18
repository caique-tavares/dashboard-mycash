/**
 * Sistema de Testes Automatizados - MyCash+
 * Executa testes críticos do sistema para validação
 */

import {
  formatCurrency,
  formatDate,
  parseCurrencyInput,
  calculatePercentage,
  calculateDifference,
  isValidEmail,
  isValidCPF,
  generateUniqueId,
  groupByCategory,
  filterByDateRange,
  sortByDate
} from '../index';
import { mockTransactions, mockBankAccounts, mockCreditCards } from '../../data/mockData';

// Testes de Formatação
export const testFormatting = () => {
  console.log('🧪 Testando Formatação...');

  // Teste formatCurrency
  const currencyTest = formatCurrency(1234.56) === 'R$ 1.234,56';
  console.log('formatCurrency(1234.56):', currencyTest ? '✅' : '❌');

  // Teste formatDate
  const date = new Date('2024-01-15');
  const dateTest = formatDate(date) === '15/01/2024';
  console.log('formatDate:', dateTest ? '✅' : '❌');

  // Teste parseCurrencyInput
  const parseTest = parseCurrencyInput('R$ 1.234,56') === 1234.56;
  console.log('parseCurrencyInput:', parseTest ? '✅' : '❌');

  return currencyTest && dateTest && parseTest;
};

// Testes de Cálculos Financeiros
export const testFinancialCalculations = () => {
  console.log('🧪 Testando Cálculos Financeiros...');

  // Teste calculatePercentage
  const percentageTest = calculatePercentage(250, 1000) === 25.0;
  console.log('calculatePercentage:', percentageTest ? '✅' : '❌');

  // Teste calculateDifference
  const difference = calculateDifference(1200, 1000);
  const diffTest = difference.difference === 200 && difference.percentage === 20.0 && difference.isIncrease;
  console.log('calculateDifference:', diffTest ? '✅' : '❌');

  // Teste groupByCategory
  const grouped = groupByCategory(mockTransactions);
  const groupTest = typeof grouped === 'object' && Object.keys(grouped).length > 0;
  console.log('groupByCategory:', groupTest ? '✅' : '❌');

  return percentageTest && diffTest && groupTest;
};

// Testes de Validação
export const testValidation = () => {
  console.log('🧪 Testando Validação...');

  // Teste isValidEmail
  const emailTest = isValidEmail('test@example.com') && !isValidEmail('invalid-email');
  console.log('isValidEmail:', emailTest ? '✅' : '❌');

  // Teste isValidCPF (estrutura)
  const cpfTest = !isValidCPF('12345678900'); // CPF inválido de teste
  console.log('isValidCPF:', cpfTest ? '✅' : '❌');

  return emailTest && cpfTest;
};

// Testes de Utilitários de ID
export const testIdGeneration = () => {
  console.log('🧪 Testando Geração de IDs...');

  const id1 = generateUniqueId();
  const id2 = generateUniqueId();
  const uniqueTest = id1 !== id2 && typeof id1 === 'string' && id1.length > 0;
  console.log('generateUniqueId:', uniqueTest ? '✅' : '❌');

  return uniqueTest;
};

// Testes de Filtros e Ordenação
export const testFiltersAndSorting = () => {
  console.log('🧪 Testando Filtros e Ordenação...');

  // Teste filterByDateRange
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');
  const filtered = filterByDateRange(mockTransactions, { startDate, endDate });
  const filterTest = Array.isArray(filtered);
  console.log('filterByDateRange:', filterTest ? '✅' : '❌');

  // Teste sortByDate
  const sorted = sortByDate(mockTransactions, 'desc');
  const sortTest = Array.isArray(sorted) && sorted.length === mockTransactions.length;
  console.log('sortByDate:', sortTest ? '✅' : '❌');

  return filterTest && sortTest;
};

// Teste de Performance Básico
export const testPerformance = () => {
  console.log('🧪 Testando Performance...');

  const startTime = performance.now();

  // Simular operações pesadas
  for (let i = 0; i < 1000; i++) {
    formatCurrency(Math.random() * 10000);
    calculatePercentage(Math.random() * 100, Math.random() * 1000);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;
  const perfTest = duration < 100; // Deve ser < 100ms
  console.log(`Performance (1000 operações): ${duration.toFixed(2)}ms -`, perfTest ? '✅' : '❌');

  return perfTest;
};

// Teste de Integridade dos Dados Mock
export const testMockDataIntegrity = () => {
  console.log('🧪 Testando Integridade dos Dados Mock...');

  // Verificar se arrays existem e têm itens
  const transactionsTest = Array.isArray(mockTransactions) && mockTransactions.length > 0;
  const accountsTest = Array.isArray(mockBankAccounts) && mockBankAccounts.length > 0;
  const cardsTest = Array.isArray(mockCreditCards) && mockCreditCards.length > 0;

  console.log('mockTransactions:', transactionsTest ? '✅' : '❌');
  console.log('mockBankAccounts:', accountsTest ? '✅' : '❌');
  console.log('mockCreditCards:', cardsTest ? '✅' : '❌');

  // Verificar estrutura básica
  const structureTest = mockTransactions.every(t =>
    t.id && t.amount && t.description && t.type && t.category && t.date
  );
  console.log('Estrutura dos dados:', structureTest ? '✅' : '❌');

  return transactionsTest && accountsTest && cardsTest && structureTest;
};

// Função Principal de Testes
export const runSystemTests = () => {
  console.log('🚀 Iniciando Testes do Sistema MyCash+\n');

  const results = {
    formatting: testFormatting(),
    financial: testFinancialCalculations(),
    validation: testValidation(),
    ids: testIdGeneration(),
    filters: testFiltersAndSorting(),
    performance: testPerformance(),
    dataIntegrity: testMockDataIntegrity(),
  };

  console.log('\n📊 Resultados dos Testes:');
  console.table(results);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(`\n🎯 Taxa de Sucesso: ${passedTests}/${totalTests} (${successRate}%)`);

  if (passedTests === totalTests) {
    console.log('🎉 Todos os testes passaram! Sistema funcionando corretamente.');
    return true;
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
    return false;
  }
};

// Executar testes automaticamente se este arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // No browser, podemos chamar manualmente
  (window as any).runSystemTests = runSystemTests;
}