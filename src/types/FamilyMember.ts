export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child' | 'spouse' | 'other';
  avatar?: string;
  birthDate?: Date;
  permissions: {
    canViewTransactions: boolean;
    canCreateTransactions: boolean;
    canEditTransactions: boolean;
    canDeleteTransactions: boolean;
    canViewGoals: boolean;
    canCreateGoals: boolean;
    canEditGoals: boolean;
    canViewCards: boolean;
    canViewAccounts: boolean;
  };
  monthlyIncome?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}