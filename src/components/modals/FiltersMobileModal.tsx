import { useState, useEffect } from 'react';
import { useFilters, TransactionTypeFilter } from '../../contexts/FilterContext';
import { mockFamilyMembers } from '../../data/mockFamilyMembers';

interface FiltersMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FiltersMobileModal = ({ isOpen, onClose }: FiltersMobileModalProps) => {
  const { transactionType, memberId, dateRange, setTransactionType, setMemberId, setDateRange } = useFilters();

  // Estado temporário local
  const [tempTransactionType, setTempTransactionType] = useState<TransactionTypeFilter>(transactionType);
  const [tempMemberId, setTempMemberId] = useState<string | null>(memberId);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  // Sincronizar estado temporário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setTempTransactionType(transactionType);
      setTempMemberId(memberId);
      setTempDateRange(dateRange);
    }
  }, [isOpen, transactionType, memberId, dateRange]);

  // Aplicar filtros e fechar modal
  const handleApplyFilters = () => {
    setTransactionType(tempTransactionType);
    setMemberId(tempMemberId);
    setDateRange(tempDateRange);
    onClose();
  };

  // Fechar sem aplicar filtros
  const handleClose = () => {
    onClose();
  };

  // Gerar calendário simples
  const generateCalendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    let week = [];
    let day = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      week.push(new Date(day));
      day.setDate(day.getDate() + 1);

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const isDateInRange = (date: Date) => {
    if (!tempDateRange.startDate || !tempDateRange.endDate) return false;
    const start = new Date(tempDateRange.startDate);
    const end = new Date(tempDateRange.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= start && checkDate <= end;
  };

  const isDateSelected = (date: Date) => {
    if (!tempDateRange.startDate || !tempDateRange.endDate) return false;
    const start = new Date(tempDateRange.startDate);
    const end = new Date(tempDateRange.endDate);
    const checkDate = new Date(date);
    return (
      checkDate.toDateString() === start.toDateString() ||
      checkDate.toDateString() === end.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    const newRange = { ...tempDateRange };
    if (!newRange.startDate || (newRange.startDate && newRange.endDate)) {
      // Primeiro clique ou reiniciando seleção
      newRange.startDate = date;
      newRange.endDate = date;
    } else if (newRange.startDate) {
      // Segundo clique
      if (date < newRange.startDate) {
        newRange.endDate = newRange.startDate;
        newRange.startDate = date;
      } else {
        newRange.endDate = date;
      }
    }
    setTempDateRange(newRange);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div
        className="w-full bg-surface-500 h-[90vh] rounded-t-3xl flex flex-col animate-slide-up"
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header Fixo */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-stroke-4 bg-surface-500 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-secondary-900">Filtros</h2>
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Tipo de Transação */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Tipo de Transação</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'all' as TransactionTypeFilter, label: 'Todos' },
                { key: 'income' as TransactionTypeFilter, label: 'Receitas' },
                { key: 'expense' as TransactionTypeFilter, label: 'Despesas' }
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setTempTransactionType(type.key)}
                  className={`h-12 rounded-full font-medium transition-all ${
                    tempTransactionType === type.key
                      ? 'bg-secondary-900 text-surface-500'
                      : 'bg-surface-500 border border-stroke-4 text-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Membro da Família */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Membro da Família</h3>
            <div className="flex flex-wrap gap-3">
              {/* Botão Todos */}
              <button
                onClick={() => setTempMemberId(null)}
                className={`h-12 px-6 rounded-full font-medium transition-all flex items-center gap-3 text-sm md:text-base ${
                  tempMemberId === null
                    ? 'bg-secondary-900 text-surface-500'
                    : 'bg-surface-500 border border-stroke-4 text-gray-600'
                }`}
              >
                Todos
              </button>

              {/* Botões de membros */}
              {mockFamilyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setTempMemberId(member.id)}
                  className={`h-12 px-4 rounded-full font-medium transition-all flex items-center gap-3 text-sm md:text-base ${
                    tempMemberId === member.id
                      ? 'bg-secondary-900 text-surface-500'
                      : 'bg-surface-500 border border-stroke-4 text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    tempMemberId === member.id
                      ? 'bg-surface-500 text-secondary-900 border-2 border-surface-500'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  <span className="text-sm">{member.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Período */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Período</h3>

            {/* Calendário */}
            <div className="bg-surface-500 border border-stroke-4 rounded-xl p-4">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-secondary-900">
                  {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
                </h4>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-1">
                {calendar.flat().map((date, index) => {
                  const isCurrentMonth = date.getMonth() === new Date().getMonth();
                  const isInRange = isDateInRange(date);
                  const isSelected = isDateSelected(date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                        isCurrentMonth
                          ? isInRange
                            ? 'bg-primary-500 text-surface-500'
                            : isSelected
                            ? 'bg-primary-500 text-surface-500'
                            : 'text-secondary-900 hover:bg-gray-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="p-4 md:p-6 border-t border-stroke-4 bg-surface-500 flex-shrink-0">
          <button
            onClick={handleApplyFilters}
            className="w-full h-12 md:h-14 bg-secondary-900 text-surface-500 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};