import { useState, useRef } from 'react';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: (member: any) => void;
}

export const AddMemberModal = ({ isOpen, onClose, onMemberAdded }: AddMemberModalProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleSuggestions = [
    'Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia', 'Sobrinho', 'Sobrinha', 'Irmão', 'Irmã'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name || name.length < 3) {
      newErrors.name = 'Por favor, insira um nome válido';
    }

    if (!role) {
      newErrors.role = 'Por favor, informe a função na família';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newMember = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@family.com`, // Mock email
      role: role.trim() as 'parent' | 'child' | 'spouse' | 'other',
      avatar: avatarUrl || undefined,
      birthDate: undefined,
      permissions: {
        canViewTransactions: true,
        canCreateTransactions: false,
        canEditTransactions: false,
        canDeleteTransactions: false,
        canViewGoals: true,
        canCreateGoals: false,
        canEditGoals: false,
        canViewCards: true,
        canViewAccounts: true,
      },
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome.replace(',', '.')) : 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Adicionar ao array mock (em produção seria API call)
    mockFamilyMembers.push(newMember);

    onMemberAdded?.(newMember);
    onClose();

    // Toast notification (simulated)
    console.log('Membro adicionado com sucesso!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Em produção, faria upload para servidor
      // Por enquanto, apenas simula uma URL
      const mockUrl = `https://via.placeholder.com/100x100?text=${file.name}`;
      setAvatarUrl(mockUrl);
    }
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setAvatarType('url');
    setAvatarUrl('');
    setMonthlyIncome('');
    setIsRoleDropdownOpen(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface-500 rounded-xl md:rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-stroke-4">
          <h2 className="text-lg md:text-2xl font-bold text-secondary-900">Adicionar Membro da Família</h2>
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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
          {/* Nome */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-sm md:text-paragraph-sm ${
                errors.name ? 'border-red-500' : 'border-stroke-4'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="Ex: João Silva"
            />
            {errors.name && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Função */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Função na Família
            </label>
            <div className="relative">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setIsRoleDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 200)}
                className={`w-full h-12 px-4 rounded-xl border bg-surface-500 text-sm md:text-paragraph-sm ${
                  errors.role ? 'border-red-500' : 'border-stroke-4'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Ex: Pai, Mãe, Filho, Avô..."
              />
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de sugestões */}
              {isRoleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-surface-500 border border-stroke-4 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {roleSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setRole(suggestion);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-paragraph-sm text-secondary-900">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.role && (
              <p className="text-red-500 text-paragraph-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Avatar */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-4">
              Avatar (opcional)
            </label>

            {/* Abas */}
            <div className="flex mb-4">
              <button
                type="button"
                onClick={() => setAvatarType('url')}
                className={`px-4 py-2 rounded-l-lg border font-medium transition-colors ${
                  avatarType === 'url'
                    ? 'bg-secondary-900 text-surface-500 border-secondary-900'
                    : 'bg-surface-500 border-stroke-4 text-secondary-900 hover:bg-gray-50'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setAvatarType('upload')}
                className={`px-4 py-2 rounded-r-lg border-l-0 border font-medium transition-colors ${
                  avatarType === 'upload'
                    ? 'bg-secondary-900 text-surface-500 border-secondary-900'
                    : 'bg-surface-500 border-stroke-4 text-secondary-900 hover:bg-gray-50'
                }`}
              >
                Upload
              </button>
            </div>

            {/* Conteúdo das abas */}
            {avatarType === 'url' ? (
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-stroke-4 bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Cole o link da imagem aqui..."
              />
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-paragraph-sm text-gray-600">Clique para fazer upload</span>
                </button>
                {avatarUrl && (
                  <p className="text-paragraph-xs text-green-600 mt-2">
                    Arquivo carregado com sucesso!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Renda Mensal */}
          <div className="mb-6">
            <label className="block text-paragraph-sm font-medium text-secondary-900 mb-2">
              Renda Mensal Estimada (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-900 font-medium">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-stroke-4 bg-surface-500 text-sm md:text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-stroke-4 bg-surface-500">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 md:px-6 py-3 border border-stroke-4 rounded-full text-secondary-900 hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 md:px-6 py-3 bg-secondary-900 text-surface-500 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base"
            >
              Adicionar Membro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};