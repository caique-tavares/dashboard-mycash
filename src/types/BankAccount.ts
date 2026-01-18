export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  agency?: string;
  accountNumber: string;
  status: 'active' | 'inactive' | 'closed';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}