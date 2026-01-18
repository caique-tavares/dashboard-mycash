import { useState, useEffect } from 'react';
import { useFinancial } from '../../contexts/FinancialContext';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AccountType = 'bank' | 'credit';

export const AddAccountModal = ({ isOpen, onClose }: AddAccountModalProps) => {
  const { addBankAccount, addCreditCard } = useFinancial();

  const [type, setType] = useState<AccountType>('bank');
  const [name, setName] = useState('');
  const [holderId, setHolderId] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [limit, setLimit] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [theme, setTheme] = useState<'black' | 'lime' | 'white'>('black');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType('bank');
      setName('');
      setHolderId('');
      setInitialBalance('');
      setClosingDay('');
      setDueDay('');
      setLimit('');
      setLastFourDigits('');
      setTheme('black');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações comuns
    if (!name || name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!holderId) {
      newErrors.holder = 'Selecione o titular';
    }

    // Validações específicas por tipo
    if (type === 'bank') {
      const balanceValue = parseFloat(initialBalance.replace(',', '.'));
      if (!initialBalance || balanceValue < 0) {
        newErrors.balance = 'Saldo inicial deve ser um valor válido';
      }
    } else {
      const closingValue = parseInt(closingDay);
      const dueValue = parseInt(dueDay);
      const limitValue = parseFloat(limit.replace(',', '.'));

      if (!closingDay || closingValue < 1 || closingValue > 31) {
        newErrors.closingDay = 'Dia de fechamento deve ser entre 1 e 31';
      }

      if (!dueDay || dueValue < 1 || dueValue > 31) {
        newErrors.dueDay = 'Dia de vencimento deve ser entre 1 e 31';
      }

      if (!limit || limitValue <= 0) {
        newErrors.limit = 'Limite deve ser maior que zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (type === 'bank') {
      const newAccount = {
        id: `bank-${Date.now()}`,
        name: name.trim(),
        bankName: name.trim(), // Usando o nome como bank name por simplicidade
        accountType: 'checking' as const,
        balance: parseFloat(initialBalance.replace(',', '.')),
        currency: 'BRL',
        accountNumber: `0000${Date.now().toString().slice(-4)}`,
        status: 'active' as const,
        color: '#060A11', // Preto padrão
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addBankAccount(newAccount);
      console.log('Conta bancária adicionada com sucesso!');
    } else {
      const newCard = {
        id: `card-${Date.now()}`,
        name: name.trim(),
        lastFourDigits: lastFourDigits || '0000',
        brand: 'visa' as const, // Padrão
        color: theme === 'black' ? '#060A11' : theme === 'lime' ? '#C4E703' : '#FFFFFF',
        limit: parseFloat(limit.replace(',', '.')),
        usedLimit: 0,
        availableLimit: parseFloat(limit.replace(',', '.')),
        dueDate: parseInt(dueDay),
        closingDate: parseInt(closingDay),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addCreditCard(newCard);
      console.log('Cartão de crédito adicionado com sucesso!');
    }

    onClose();
  };

  const themeOptions = [
    { key: 'black', label: 'Black', color: 'bg-secondary-900' },
    { key: 'lime', label: 'Lime', color: 'bg-green-400' },
    { key: 'white', label: 'White', color: 'bg-surface-500 border-2 border-stroke-4' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface-500 rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stroke-4">
          <h2 className="text-2xl font-bold text-secondary-900">Adicionar Conta/Cartão</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5 text-secondary-900"
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
        <div className="flex-1 overflow-y-auto p-6">
          {/* Toggle Tipo */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType('bank')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  type === 'bank'
                    ? 'bg-secondary-900 text-surface-500'
                    : 'bg-surface-500 border border-stroke-4 text-gray-600 hover:text-secondary-900'
                }`}
              >
                Conta Bancária
              </button>
              <button
                onClick={() => setType('credit')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  type === 'credit'
                    ? 'bg-secondary-900 text-surface-500'
                    : 'bg-surface-500 border border-stroke-4 text-gray-600 hover:text-secondary-900'
                }`}
              >
                Cartão de Crédito
              </button>
            </div>
          </div>

          {/* Campo Nome */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              {type === 'bank' ? 'Nome da Conta' : 'Nome do Cartão'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-paragraph-sm ${
                errors.name ? 'border-red-500' : 'border-stroke-4'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder={type === 'bank' ? 'Ex: Nubank Conta' : 'Ex: Nubank Mastercard'}
            />
            {errors.name && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Campo Titular */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Titular
            </label>
            <select
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.holder ? 'border-red-500' : 'border-stroke-4'
              }`}
            >
              <option value="">Selecione o titular</option>
              {mockFamilyMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.holder && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.holder}</p>
            )}
          </div>

          {/* Campos específicos para Conta Bancária */}
          {type === 'bank' && (
            <div className="mb-6">
              <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                Saldo Inicial
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-900 font-medium">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-surface-500 text-paragraph-sm ${
                    errors.balance ? 'border-red-500' : 'border-stroke-4'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="0,00"
                />
              </div>
              {errors.balance && (
                <p className="text-red-500 text-paragraph-xs mt-1">{errors.balance}</p>
              )}
            </div>
          )}

          {/* Campos específicos para Cartão de Crédito */}
          {type === 'credit' && (
            <>
              {/* Dias */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                    Dia de Fechamento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-paragraph-sm ${
                      errors.closingDay ? 'border-red-500' : 'border-stroke-4'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="1 a 31"
                  />
                  {errors.closingDay && (
                    <p className="text-red-500 text-paragraph-xs mt-1">{errors.closingDay}</p>
                  )}
                </div>
                <div>
                  <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                    Dia de Vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-paragraph-sm ${
                      errors.dueDay ? 'border-red-500' : 'border-stroke-4'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="1 a 31"
                  />
                  {errors.dueDay && (
                    <p className="text-red-500 text-paragraph-xs mt-1">{errors.dueDay}</p>
                  )}
                </div>
              </div>

              {/* Limite */}
              <div className="mb-6">
                <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                  Limite Total
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-900 font-medium">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-surface-500 text-paragraph-sm ${
                      errors.limit ? 'border-red-500' : 'border-stroke-4'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="0,00"
                  />
                </div>
                {errors.limit && (
                  <p className="text-red-500 text-paragraph-xs mt-1">{errors.limit}</p>
                )}
              </div>

              {/* Últimos 4 dígitos */}
              <div className="mb-6">
                <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
                  Últimos 4 Dígitos (opcional)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={lastFourDigits}
                  onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 px-4 rounded-xl border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1234"
                />
              </div>

              {/* Tema Visual */}
              <div className="mb-6">
                <label className="block text-paragraph-sm font-medium text-secondary-900 mb-4">
                  Tema Visual
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTheme(option.key as 'black' | 'lime' | 'white')}
                      className={`h-16 rounded-xl border-2 transition-all ${
                        theme === option.key
                          ? 'border-primary-500 bg-opacity-90'
                          : 'border-stroke-4 hover:border-gray-400'
                      } ${option.color} flex items-center justify-center`}
                    >
                      <span className={`text-paragraph-sm font-medium ${
                        option.key === 'white' ? 'text-secondary-900' : 'text-surface-500'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stroke-4 bg-surface-500">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-secondary-900 text-surface-500 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};