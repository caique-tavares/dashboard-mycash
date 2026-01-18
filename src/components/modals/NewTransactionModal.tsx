import { useState, useEffect } from 'react';
import { useFinancial } from '../../contexts/FinancialContext';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = 'income' | 'expense';

export const NewTransactionModal = ({ isOpen, onClose }: NewTransactionModalProps) => {
  const { transactions, bankAccounts, creditCards, addTransaction } = useFinancial();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [memberId, setMemberId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('');
      setMemberId('');
      setAccountId('');
      setInstallments(1);
      setIsRecurring(false);
      setIsCreatingCategory(false);
      setNewCategoryName('');
      setErrors({});
    }
  }, [isOpen]);

  // Reset installments when account changes or type changes
  useEffect(() => {
    if (type === 'income') {
      setInstallments(1);
      setIsRecurring(false);
    }
  }, [type, accountId]);

  const getCategories = () => {
    const allCategories = transactions.map(t => t.category);
    const uniqueCategories = [...new Set(allCategories)];

    if (type === 'income') {
      return uniqueCategories.filter(cat =>
        ['Salário', 'Trabalho', 'Bônus', 'Consultoria'].includes(cat) ||
        !['Aluguel', 'Moradia', 'Alimentação', 'Supermercado', 'Academia', 'Saúde', 'Transporte', 'Combustível', 'Streaming', 'Entretenimento', 'Cartão de Crédito', 'Notebook', 'Viagem', 'Restaurante'].includes(cat)
      );
    } else {
      return uniqueCategories.filter(cat =>
        ['Moradia', 'Alimentação', 'Saúde', 'Entretenimento', 'Transporte', 'Viagem'].includes(cat) ||
        !['Salário', 'Trabalho', 'Bônus', 'Consultoria'].includes(cat)
      );
    }
  };

  const selectedAccount = [...bankAccounts, ...creditCards].find(acc => acc.id === accountId);
  const isCreditCardSelected = selectedAccount && 'brand' in selectedAccount;

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      setCategory(newCategoryName.trim());
      setIsCreatingCategory(false);
      setNewCategoryName('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (!amount || amountValue <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!description || description.length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres';
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (!accountId) {
      newErrors.account = 'Selecione uma conta ou cartão';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newTransaction = {
      id: `transaction-${Date.now()}`,
      amount: parseFloat(amount.replace(',', '.')),
      description: description.trim(),
      type,
      category,
      date: new Date(),
      bankAccountId: selectedAccount && !('brand' in selectedAccount) ? selectedAccount.id : undefined,
      creditCardId: selectedAccount && 'brand' in selectedAccount ? selectedAccount.id : undefined,
      memberId: memberId || undefined,
      installments,
      tags: [],
      recurring: isRecurring,
      isRecurring,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTransaction(newTransaction);
    onClose();

    // Toast notification (simulated)
    console.log('Transação registrada com sucesso!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface-500 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-stroke-4 bg-surface-500">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            type === 'income' ? 'bg-green-400' : 'bg-secondary-900'
          }`}>
            <svg
              className={`w-8 h-8 ${type === 'income' ? 'text-secondary-900' : 'text-surface-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={type === 'income'
                  ? "M19 14l-7 7m0 0l-7-7m7 7V3"
                  : "M5 10l7-7m0 0l7 7m-7-7v18"
                }
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Nova Transação</h1>
            <p className="text-paragraph-sm text-gray-600">Registre uma nova entrada ou saída</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg
            className="w-6 h-6 text-secondary-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {/* Toggle Tipo */}
          <div className="mb-6">
            <div className="flex bg-gray-200 rounded-full p-1 w-fit">
              <button
                onClick={() => setType('income')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  type === 'income'
                    ? 'bg-surface-500 text-secondary-900 shadow-sm'
                    : 'text-gray-600 hover:text-secondary-900'
                }`}
              >
                Receita
              </button>
              <button
                onClick={() => setType('expense')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-surface-500 text-secondary-900 shadow-sm'
                    : 'text-gray-600 hover:text-secondary-900'
                }`}
              >
                Despesa
              </button>
            </div>
          </div>

          {/* Campo Valor */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Valor da Transação
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-900 font-medium">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full h-12 md:h-14 pl-12 pr-4 rounded-xl border bg-surface-500 text-base md:text-heading-sm font-bold ${
                  errors.amount ? 'border-red-500' : 'border-stroke-4'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Campo Descrição */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full h-12 md:h-14 px-4 rounded-xl border bg-surface-500 text-sm md:text-paragraph-sm ${
                errors.description ? 'border-red-500' : 'border-stroke-4'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="Ex: Supermercado Semanal"
            />
            {errors.description && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Campo Categoria */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Categoria
            </label>
            {!isCreatingCategory ? (
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full h-12 md:h-14 px-4 rounded-xl border bg-surface-500 text-sm md:text-paragraph-sm appearance-none ${
                    errors.category ? 'border-red-500' : 'border-stroke-4'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Selecione uma categoria</option>
                  {getCategories().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsCreatingCategory(true)}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600"
                >
                  + Nova
                </button>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 h-14 px-4 rounded-xl border border-stroke-4 bg-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nome da nova categoria"
                  autoFocus
                />
                <button
                  onClick={handleCreateCategory}
                  className="px-4 py-2 bg-primary-500 text-secondary-900 rounded-xl hover:bg-primary-600 transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setIsCreatingCategory(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-secondary-900 rounded-xl hover:bg-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            {errors.category && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Grid Membro e Conta */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Membro */}
            <div>
              <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                Membro
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full h-12 md:h-14 px-4 rounded-xl border border-stroke-4 bg-surface-500 text-sm md:text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Família (Geral)</option>
                {mockFamilyMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Conta/Cartão */}
            <div>
              <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                Conta / Cartão
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className={`w-full h-12 md:h-14 px-4 rounded-xl border bg-surface-500 text-sm md:text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.account ? 'border-red-500' : 'border-stroke-4'
                }`}
              >
                <option value="">Selecione uma conta</option>
                <optgroup label="Contas Bancárias">
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Cartões de Crédito">
                  {creditCards.map(card => (
                    <option key={card.id} value={card.id}>
                      {card.name} **** {card.lastFourDigits}
                    </option>
                  ))}
                </optgroup>
              </select>
              {errors.account && (
                <p className="text-red-500 text-paragraph-xs mt-1">{errors.account}</p>
              )}
            </div>
          </div>

          {/* Parcelamento (condicional) */}
          {isCreditCardSelected && type === 'expense' && (
            <div className="mb-6">
              <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                Parcelamento
              </label>
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                disabled={isRecurring}
                className="w-full h-12 md:h-14 px-4 rounded-xl border border-stroke-4 bg-surface-500 text-sm md:text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <option value={1}>À vista (1x)</option>
                {Array.from({ length: 11 }, (_, i) => i + 2).map(num => (
                  <option key={num} value={num}>{num}x</option>
                ))}
              </select>
              {isRecurring && (
                <p className="text-gray-500 text-paragraph-xs mt-1 italic">
                  Parcelamento desabilitado para despesas recorrentes
                </p>
              )}
            </div>
          )}

          {/* Checkbox Recorrente (condicional) */}
          {type === 'expense' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => {
                    setIsRecurring(e.target.checked);
                    if (e.target.checked) {
                      setInstallments(1);
                    }
                  }}
                  disabled={installments > 1}
                  className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-secondary-900">Despesa Recorrente</span>
                    <svg className="w-4 h-4 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-paragraph-xs text-gray-600 mt-1">
                    {installments > 1
                      ? 'Não disponível para compras parceladas'
                      : 'Esta despesa se repetirá automaticamente todo mês'
                    }
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-stroke-4 bg-surface-500">
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-3 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 md:px-8 py-3 bg-secondary-900 text-surface-500 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base"
          >
            Salvar Transação
          </button>
        </div>
      </div>
    </div>
  );
};