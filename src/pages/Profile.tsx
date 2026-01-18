import { useState } from 'react';
import { mockFamilyMembers } from '../data/mockFamilyMembers';
import { formatCurrency } from '../utils/currency.utils';
import { AddMemberModal } from '../components/modals/AddMemberModal';

// Dados mock para categorias
const mockIncomeCategories = [
  { id: '1', name: 'Salário', color: '#15BE78' },
  { id: '2', name: 'Freelance', color: '#2A89EF' },
  { id: '3', name: 'Investimentos', color: '#D7FF00' },
];

const mockExpenseCategories = [
  { id: '1', name: 'Alimentação', color: '#E61E32' },
  { id: '2', name: 'Transporte', color: '#8A05BE' },
  { id: '3', name: 'Moradia', color: '#060A11' },
  { id: '4', name: 'Trabalho', color: '#C4E703' },
];

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Estados das configurações
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    billReminders: true,
    cardLimitAlerts: true,
    monthlySummary: false,
    goalAchievements: true,
  });
  const [currencyFormat, setCurrencyFormat] = useState('BRL');
  const [dateFormat, setDateFormat] = useState('DD/MM/AAAA');

  // Usuário atual (primeiro membro como usuário principal)
  const currentUser = mockFamilyMembers[0];

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    // Em produção, isso faria logout da aplicação
    console.log('Logout realizado');
    alert('Logout realizado com sucesso!');
  };

  const handleExportData = () => {
    // Simulação de exportação de dados
    const exportData = {
      familyMembers: mockFamilyMembers,
      incomeCategories: mockIncomeCategories,
      expenseCategories: mockExpenseCategories,
      settings: {
        darkMode,
        notifications,
        currencyFormat,
        dateFormat,
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mycash_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Dados exportados com sucesso!');
  };

  const handleClearData = () => {
    const confirmed = confirm(
      'ATENÇÃO: Esta ação irá remover TODOS os dados do sistema e não pode ser desfeita. Tem certeza que deseja continuar?'
    );

    if (confirmed) {
      const finalConfirm = confirm(
        'Última chance: Todos os dados serão perdidos permanentemente. Deseja realmente continuar?'
      );

      if (finalConfirm) {
        // Em produção, isso limparia o banco de dados
        alert('Todos os dados foram removidos. O aplicativo será recarregado.');
        window.location.reload();
      }
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Componente Toggle Switch
  const ToggleSwitch = ({
    checked,
    onChange,
    disabled = false,
    label
  }: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label?: string;
  }) => (
    <div className="flex items-center justify-between">
      {label && (
        <span className={`text-paragraph-sm ${disabled ? 'text-gray-400' : 'text-secondary-900'}`}>
          {label}
        </span>
      )}
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          disabled
            ? 'bg-gray-200 cursor-not-allowed'
            : checked
            ? 'bg-primary-500'
            : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-md font-bold text-secondary-900 mb-2">Perfil</h1>
        <p className="text-paragraph-sm text-gray-600">Gerencie suas informações pessoais e configurações.</p>
      </div>

      {/* Sistema de Abas */}
      <div className="border-b border-stroke-4 mb-8">
        <div className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-600 hover:text-secondary-900'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-600 hover:text-secondary-900'
            }`}
          >
            Configurações
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'info' && (
        <div className="space-y-8">
          {/* Seção de Perfil */}
          <div className="bg-surface-500 rounded-xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-30 h-30 rounded-full object-cover border-4 border-surface-500"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-primary-500 flex items-center justify-center border-4 border-surface-500">
                    <span className="text-2xl font-bold text-secondary-900">
                      {getInitials(currentUser.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  {currentUser.name}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {currentUser.role}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-paragraph-lg text-gray-600">
                      {currentUser.email}
                    </span>
                  </div>

                  {currentUser.monthlyIncome && currentUser.monthlyIncome > 0 && (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-paragraph-lg text-gray-600">
                        Renda mensal: {formatCurrency(currentUser.monthlyIncome)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botão Editar Perfil */}
                <button className="bg-primary-500 text-secondary-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-400 transition-colors">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Seção Membros da Família */}
          <div className="bg-surface-500 rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-900">Membros da Família</h3>
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="bg-primary-500 text-secondary-900 px-4 py-2 rounded-full font-semibold hover:bg-primary-400 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Membro
              </button>
            </div>

            {mockFamilyMembers.length === 1 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Adicione sua família</h4>
                <p className="text-gray-600 mb-6">
                  Conecte os membros da sua família para gerenciar finanças juntos.
                </p>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="bg-secondary-900 text-surface-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Primeiro Membro
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mockFamilyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      // TODO: Abrir modal de edição do membro
                      console.log('Editar membro:', member.id);
                    }}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-paragraph-lg font-semibold text-secondary-900 truncate">
                        {member.name}
                      </h4>
                      <p className="text-paragraph-sm text-gray-600">
                        {member.role}
                      </p>
                    </div>

                    {/* Renda */}
                    {member.monthlyIncome && member.monthlyIncome > 0 && (
                      <div className="text-right">
                        <p className="text-paragraph-sm font-medium text-secondary-900">
                          {formatCurrency(member.monthlyIncome)}
                        </p>
                        <p className="text-paragraph-xs text-gray-500">
                          por mês
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão Sair */}
          <div className="flex justify-center pt-8">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Aba Configurações */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Grid responsivo para desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preferências de Exibição */}
            <div className="bg-surface-500 rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-bold text-secondary-900 mb-6">Preferências de Exibição</h3>

              <div className="space-y-6">
                {/* Modo Escuro */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-paragraph-sm text-secondary-900">Modo Escuro</span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      Em breve
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    disabled={true}
                  />
                </div>

                {/* Moeda Padrão */}
                <div className="flex items-center justify-between">
                  <span className="text-paragraph-sm text-secondary-900">Moeda Padrão</span>
                  <select
                    value={currencyFormat}
                    onChange={(e) => setCurrencyFormat(e.target.value)}
                    className="px-3 py-2 border border-stroke-4 rounded-lg bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                {/* Formato de Data */}
                <div className="flex items-center justify-between">
                  <span className="text-paragraph-sm text-secondary-900">Formato de Data</span>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="px-3 py-2 border border-stroke-4 rounded-lg bg-surface-500 text-paragraph-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="DD/MM/AAAA">DD/MM/AAAA</option>
                    <option value="MM/DD/AAAA">MM/DD/AAAA</option>
                    <option value="AAAA-MM-DD">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-surface-500 rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-bold text-secondary-900 mb-6">Notificações</h3>

              <div className="space-y-6">
                <ToggleSwitch
                  checked={notifications.billReminders}
                  onChange={() => handleNotificationToggle('billReminders')}
                  label="Lembrete de vencimento de contas"
                />

                <ToggleSwitch
                  checked={notifications.cardLimitAlerts}
                  onChange={() => handleNotificationToggle('cardLimitAlerts')}
                  label="Alerta de aproximação do limite de cartão"
                />

                <ToggleSwitch
                  checked={notifications.monthlySummary}
                  onChange={() => handleNotificationToggle('monthlySummary')}
                  label="Resumo mensal por email"
                />

                <ToggleSwitch
                  checked={notifications.goalAchievements}
                  onChange={() => handleNotificationToggle('goalAchievements')}
                  label="Notificações de novos objetivos alcançados"
                />
              </div>
            </div>
          </div>

          {/* Gerenciar Categorias */}
          <div className="bg-surface-500 rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-bold text-secondary-900 mb-6">Gerenciar Categorias</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Categorias de Receita */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-secondary-900">Categorias de Receita</h4>
                  <button className="bg-primary-500 text-secondary-900 px-3 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {mockIncomeCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-paragraph-sm font-medium text-secondary-900">
                          {category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-secondary-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorias de Despesa */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-secondary-900">Categorias de Despesa</h4>
                  <button className="bg-primary-500 text-secondary-900 px-3 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {mockExpenseCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-paragraph-sm font-medium text-secondary-900">
                          {category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-secondary-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid para as próximas seções */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados e Privacidade */}
            <div className="bg-surface-500 rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-bold text-secondary-900 mb-6">Dados e Privacidade</h3>

              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="w-full bg-secondary-900 text-surface-500 px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Todos os Dados
                </button>

                <button
                  onClick={handleClearData}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar Todos os Dados
                </button>

                <p className="text-paragraph-xs text-gray-500 text-center">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            {/* Sobre */}
            <div className="bg-surface-500 rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-bold text-secondary-900 mb-6">Sobre o mycash+</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-paragraph-sm text-gray-600">Versão do sistema</span>
                  <span className="text-paragraph-sm font-medium text-secondary-900">v1.0.0</span>
                </div>

                <p className="text-paragraph-sm text-gray-600 text-center py-2">
                  Sistema de gestão financeira familiar
                </p>

                <div className="flex gap-4 pt-2">
                  <button className="flex-1 text-primary-500 hover:text-primary-600 transition-colors text-paragraph-sm font-medium">
                    Termos de Uso
                  </button>
                  <button className="flex-1 text-primary-500 hover:text-primary-600 transition-colors text-paragraph-sm font-medium">
                    Política de Privacidade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Membro */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onMemberAdded={(newMember) => {
          console.log('Novo membro adicionado:', newMember);
        }}
      />
    </div>
  );
};