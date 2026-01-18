export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  creditCardId?: string;
  bankAccountId?: string;
  memberId?: string;
  installments?: number;
  isPaid?: boolean;
  tags?: string[];
  recurring?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}