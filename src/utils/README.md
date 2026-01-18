# Utilitários do Sistema

Este diretório contém todas as funções utilitárias organizadas por categoria para garantir consistência e reutilização em todo o sistema MyCash.

## 📁 Estrutura

```
utils/
├── currency.utils.ts     # Formatação de valores monetários
├── date.utils.ts         # Formatação e manipulação de datas
├── array.utils.ts        # Manipulação de arrays e objetos
├── financial.utils.ts    # Cálculos financeiros
├── validation.utils.ts   # Validação de dados
├── id.utils.ts          # Geração de IDs únicos
├── index.ts             # Exports organizados
└── tests/
    └── utils.test.ts    # Testes básicos
```

## 💰 Utilitários de Moeda (`currency.utils.ts`)

### `formatCurrency(value: number): string`
Formata um número como moeda brasileira.
```typescript
formatCurrency(1234.56) // "R$ 1.234,56"
```

### `formatCompactCurrency(value: number): string`
Formata valores grandes de forma compacta para gráficos.
```typescript
formatCompactCurrency(2500)    // "R$ 2,5k"
formatCompactCurrency(1200000) // "R$ 1,2M"
```

### `parseCurrencyInput(input: string): number`
Converte string de input do usuário em número limpo.
```typescript
parseCurrencyInput("R$ 1.234,56") // 1234.56
parseCurrencyInput("1,50")        // 1.50
```

## 📅 Utilitários de Data (`date.utils.ts`)

### `formatDate(date: Date): string`
Formata data no padrão brasileiro.
```typescript
formatDate(new Date('2024-01-15')) // "15/01/2024"
```

### `formatDateRange(startDate: Date, endDate: Date): string`
Formata intervalo de datas.
```typescript
formatDateRange(start, end) // "01 jan - 31 jan, 2024"
```

### `formatRelativeDate(date: Date): string`
Formata data de forma relativa.
```typescript
formatRelativeDate(new Date()) // "Hoje"
formatRelativeDate(yesterday)   // "Ontem"
```

## 📊 Utilitários de Array (`array.utils.ts`)

### `groupByCategory(transactions: Transaction[]): Record<string, number>`
Agrupa transações por categoria e soma valores.
```typescript
groupByCategory(transactions)
// { "Alimentação": 1500, "Transporte": 800 }
```

### `filterByDateRange(transactions, dateRange): Transaction[]`
Filtra transações por intervalo de datas.
```typescript
filterByDateRange(transactions, {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31')
})
```

### `sortByDate(transactions, order): Transaction[]`
Ordena transações por data.
```typescript
sortByDate(transactions, 'desc') // Mais recentes primeiro
```

## 💼 Utilitários Financeiros (`financial.utils.ts`)

### `calculatePercentage(partial: number, total: number): number`
Calcula percentual com uma casa decimal.
```typescript
calculatePercentage(250, 1000) // 25.0
```

### `calculateDifference(current: number, previous: number)`
Calcula diferença absoluta e percentual.
```typescript
calculateDifference(1200, 1000)
// { difference: 200, percentage: 20.0, isIncrease: true }
```

### `calculateInstallmentValue(totalValue: number, installments: number): number`
Calcula valor de cada parcela.
```typescript
calculateInstallmentValue(1000, 10) // 100.00
```

## ✅ Utilitários de Validação (`validation.utils.ts`)

### `isValidEmail(email: string): boolean`
Valida formato de email.
```typescript
isValidEmail("user@example.com") // true
```

### `isValidCPF(cpf: string): boolean`
Valida CPF brasileiro (estrutura).
```typescript
isValidCPF("123.456.789-00") // false (exemplo)
```

### `isPositiveNumber(value: any): boolean`
Verifica se valor é número positivo > 0.
```typescript
isPositiveNumber(10.5) // true
isPositiveNumber(-5)   // false
```

## 🆔 Utilitários de ID (`id.utils.ts`)

### `generateUniqueId(): string`
Gera ID único com timestamp e randomização.
```typescript
generateUniqueId() // "id_1703123456789_123456"
```

### `generateTransactionId(): string`
Gera ID específico para transações.
```typescript
generateTransactionId() // "txn_1703123456789_123456"
```

### `generateUUID(): string`
Gera UUID v4 (com fallback).
```typescript
generateUUID() // "123e4567-e89b-12d3-a456-426614174000"
```

## 🧪 Testes

### Executando Testes
```typescript
import { runUtilsTests } from './utils';

// No console do navegador
runUtilsTests();
```

### Cobertura de Testes
- ✅ Formatação de moeda
- ✅ Formatação de datas
- ✅ Cálculos financeiros
- ✅ Validação de dados
- ✅ Geração de IDs

## 📋 Como Usar

### Importação Direta
```typescript
import { formatCurrency, formatDate } from '../utils';
```

### Importação do Índice
```typescript
import {
  formatCurrency,
  formatDate,
  calculatePercentage,
  isValidEmail
} from '../utils';
```

## 🎯 Boas Práticas

1. **JSDoc**: Todas as funções têm documentação completa
2. **Tipagem**: TypeScript rigoroso em todos os parâmetros
3. **Consistência**: Padrões brasileiros (R$, DD/MM/AAAA)
4. **Performance**: Funções otimizadas para reuso
5. **Testabilidade**: Funções puras e previsíveis
6. **Fallbacks**: Tratamento de casos especiais

## 🔄 Manutenção

- Adicionar novos utilitários seguindo a categoria apropriada
- Manter JSDoc atualizado
- Incluir testes para novas funções críticas
- Atualizar este README quando adicionar funcionalidades