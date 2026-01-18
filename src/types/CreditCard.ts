export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other';
  color: string;
  limit: number;
  usedLimit: number;
  availableLimit: number;
  dueDate: number; // dia do mês (1-31)
  closingDate: number; // dia do mês (1-31)
  status: 'active' | 'blocked' | 'cancelled';
  bankAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}