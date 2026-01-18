import { createContext, useContext, ReactNode, useMemo } from 'react';
import { Transaction, BankAccount, CreditCard } from '../types';

interface FinancialContextType {
  transactions: Transaction[];
  bankAccounts: BankAccount[];
  creditCards: CreditCard[];
  filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    type?: 'income' | 'expense';
  };
  calculateTotalBalance: () => number;
  calculateIncomeForPeriod: () => number;
  calculateExpensesForPeriod: () => number;
  calculateBalanceGrowth: () => number; // Percentual de crescimento
  addTransaction: (transaction: Transaction) => void;
  addBankAccount: (account: BankAccount) => void;
  addCreditCard: (card: CreditCard) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

interface FinancialProviderProps {
  children: ReactNode;
  transactions?: Transaction[];
  bankAccounts?: BankAccount[];
  creditCards?: CreditCard[];
  filters?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    type?: 'income' | 'expense';
  };
}

export const FinancialProvider = ({
  children,
  transactions = [],
  bankAccounts = [],
  creditCards = [],
  filters = {},
}: FinancialProviderProps) => {
  const calculateTotalBalance = (): number => {
    // Soma todos os saldos das contas bancárias ativas
    const accountsBalance = bankAccounts
      .filter(account => account.status === 'active')
      .reduce((sum, account) => sum + account.balance, 0);

    // Subtrai o limite usado dos cartões de crédito ativos
    const creditCardsDebt = creditCards
      .filter(card => card.status === 'active')
      .reduce((sum, card) => sum + card.usedLimit, 0);

    return accountsBalance - creditCardsDebt;
  };

  const calculateIncomeForPeriod = (): number => {
    const { startDate, endDate } = filters;
    const now = new Date();
    const periodStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = endDate || now;

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'income' &&
          transactionDate >= periodStart &&
          transactionDate <= periodEnd
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const calculateExpensesForPeriod = (): number => {
    const { startDate, endDate } = filters;
    const now = new Date();
    const periodStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = endDate || now;

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'expense' &&
          transactionDate >= periodStart &&
          transactionDate <= periodEnd
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const calculateBalanceGrowth = (): number => {
    const currentBalance = calculateTotalBalance();
    
    // Calcula saldo de 30 dias atrás
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Simula cálculo do saldo antigo (em produção, isso viria de dados históricos)
    // Por enquanto, vamos calcular baseado nas transações dos últimos 30 dias
    const incomeLast30Days = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && date >= thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const expensesLast30Days = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const netChange = incomeLast30Days - expensesLast30Days;
    const estimatedOldBalance = currentBalance - netChange;

    if (estimatedOldBalance === 0) return 0;

    const growth = ((currentBalance - estimatedOldBalance) / Math.abs(estimatedOldBalance)) * 100;
    return Math.round(growth * 10) / 10; // Arredonda para 1 casa decimal
  };

  const addTransaction = (transaction: Transaction) => {
    // Em produção, isso faria uma chamada para a API
    console.log('Adicionando transação:', transaction);
    transactions.push(transaction);
  };

  const addBankAccount = (account: BankAccount) => {
    // Em produção, isso faria uma chamada para a API
    console.log('Adicionando conta bancária:', account);
    bankAccounts.push(account);
  };

  const addCreditCard = (card: CreditCard) => {
    // Em produção, isso faria uma chamada para a API
    console.log('Adicionando cartão de crédito:', card);
    creditCards.push(card);
  };

  const value = useMemo(
    () => ({
      transactions,
      bankAccounts,
      creditCards,
      filters,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateBalanceGrowth,
      addTransaction,
      addBankAccount,
      addCreditCard,
    }),
    [transactions, bankAccounts, creditCards, filters, addTransaction, addBankAccount, addCreditCard]
  );

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};