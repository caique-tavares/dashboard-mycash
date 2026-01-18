/**
 * Testes básicos para utilitários críticos
 * Estes testes podem ser executados manualmente para verificar o funcionamento
 */

// Importações
import {
  formatCurrency,
  formatCompactCurrency,
  parseCurrencyInput,
  formatDate,
  formatDateRange,
  groupByCategory,
  calculatePercentage,
  calculateDifference,
  isValidEmail,
  isValidCPF,
  generateUniqueId,
} from '../index';

// Mock de transações para testes
const mockTransactions = [
  {
    id: '1',
    amount: 100,
    description: 'Salário',
    type: 'income' as const,
    category: 'Salário',
    date: new Date('2024-01-15'),
    memberId: 'user1',
    installments: 1,
    isPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    amount: 50,
    description: 'Almoço',
    type: 'expense' as const,
    category: 'Alimentação',
    date: new Date('2024-01-16'),
    memberId: 'user1',
    installments: 1,
    isPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    amount: 30,
    description: 'Transporte',
    type: 'expense' as const,
    category: 'Transporte',
    date: new Date('2024-01-17'),
    memberId: 'user1',
    installments: 1,
    isPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Testes de moeda
console.log('🧪 Testes de Utilitários - Moeda');
console.log('formatCurrency(1234.56):', formatCurrency(1234.56));
console.log('formatCompactCurrency(2500):', formatCompactCurrency(2500));
console.log('parseCurrencyInput("R$ 1.234,56"):', parseCurrencyInput('R$ 1.234,56'));

// Testes de data
console.log('\n🧪 Testes de Utilitários - Data');
console.log('formatDate(new Date()):', formatDate(new Date()));
console.log('formatDateRange(start, end):', formatDateRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
));

// Testes de array
console.log('\n🧪 Testes de Utilitários - Array');
console.log('groupByCategory:', groupByCategory(mockTransactions));

// Testes financeiros
console.log('\n🧪 Testes de Utilitários - Financeiro');
console.log('calculatePercentage(250, 1000):', calculatePercentage(250, 1000));
console.log('calculateDifference(1200, 1000):', calculateDifference(1200, 1000));

// Testes de validação
console.log('\n🧪 Testes de Utilitários - Validação');
console.log('isValidEmail("test@example.com"):', isValidEmail('test@example.com'));
console.log('isValidCPF("12345678900"):', isValidCPF('12345678900')); // CPF inválido de teste

// Testes de ID
console.log('\n🧪 Testes de Utilitários - ID');
console.log('generateUniqueId():', generateUniqueId());
    console.log('generateUniqueId() (segundo):', generateUniqueId());

// Função de verificação de testes
export const runUtilsTests = () => {
  console.log('\n✅ Todos os testes de utilitários foram executados!');
  console.log('Verifique os logs acima para confirmar o funcionamento correto.');

  // Verificações básicas
  const currencyTest = formatCurrency(100) === 'R$ 100,00';
  const dateTest = formatDate(new Date('2024-01-15')) === '15/01/2024';
  const percentageTest = calculatePercentage(50, 200) === 25.0;

  console.log('\n📊 Resultados das verificações:');
  console.log('Moeda:', currencyTest ? '✅' : '❌');
  console.log('Data:', dateTest ? '✅' : '❌');
  console.log('Percentual:', percentageTest ? '✅' : '❌');

  if (currencyTest && dateTest && percentageTest) {
    console.log('\n🎉 Todos os testes básicos passaram!');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique as implementações.');
  }
};

// Executa testes automaticamente se este arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // No browser, podemos chamar manualmente
  (window as any).runUtilsTests = runUtilsTests;
}