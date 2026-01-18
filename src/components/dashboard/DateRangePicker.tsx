import { useState, useRef, useEffect } from 'react';
import { useFilters, DateRange } from '../../contexts/FilterContext';

const formatDate = (date: Date): string => {
  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}`;
};

const formatDateRange = (range: DateRange): string => {
  if (!range.startDate || !range.endDate) return 'Selecionar período';
  
  const start = formatDate(range.startDate);
  const end = formatDate(range.endDate);
  const year = range.endDate.getFullYear();
  
  return `${start} - ${end}, ${year}`;
};

export const DateRangePicker = () => {
  const { dateRange, setDateRange } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(dateRange.startDate);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(dateRange.endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState<'start' | 'end'>('start');
  const [isMobile, setIsMobile] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDateClick = (date: Date) => {
    if (isSelecting === 'start' || !selectedStart || date < selectedStart) {
      setSelectedStart(date);
      setSelectedEnd(null);
      setIsSelecting('end');
    } else {
      setSelectedEnd(date);
      setIsSelecting('start');
    }
  };

  const handleConfirm = () => {
    if (selectedStart && selectedEnd) {
      setDateRange({ startDate: selectedStart, endDate: selectedEnd });
    } else if (selectedStart) {
      setDateRange({ startDate: selectedStart, endDate: selectedStart });
    }
    setIsOpen(false);
  };

  const handleQuickSelect = (type: 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear') => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date();

    switch (type) {
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last3Months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date();
    }

    setSelectedStart(start);
    setSelectedEnd(end);
    setDateRange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const isDateSelected = (date: Date): boolean => {
    if (selectedStart && date.getTime() === selectedStart.getTime()) return true;
    if (selectedEnd && date.getTime() === selectedEnd.getTime()) return true;
    return false;
  };

  const Calendar = ({ month }: { month: Date }) => {
    const days = getDaysInMonth(month);
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-label-md font-semibold text-secondary-900">
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const prevMonth = new Date(month);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const nextMonth = new Date(month);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-label-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="aspect-square" />;
            }
            const inRange = isDateInRange(day);
            const selected = isDateSelected(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <button
                key={day.getTime()}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-lg text-paragraph-sm font-medium transition-colors ${
                  selected
                    ? 'bg-secondary-900 text-surface-500'
                    : inRange
                    ? 'bg-primary-500/20 text-secondary-900'
                    : isToday
                    ? 'bg-gray-100 text-secondary-900 font-semibold'
                    : 'text-secondary-900 hover:bg-gray-50'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const CalendarContent = () => (
    <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-lg border border-stroke-4">
      <div className="mb-4">
        <h3 className="text-label-sm font-semibold text-secondary-900 mb-3">Atalhos Rápidos</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickSelect('thisMonth')}
            className="px-4 py-2 bg-gray-50 rounded-lg text-paragraph-sm text-secondary-900 hover:bg-gray-100 transition-colors"
          >
            Este mês
          </button>
          <button
            onClick={() => handleQuickSelect('lastMonth')}
            className="px-4 py-2 bg-gray-50 rounded-lg text-paragraph-sm text-secondary-900 hover:bg-gray-100 transition-colors"
          >
            Mês passado
          </button>
          <button
            onClick={() => handleQuickSelect('last3Months')}
            className="px-4 py-2 bg-gray-50 rounded-lg text-paragraph-sm text-secondary-900 hover:bg-gray-100 transition-colors"
          >
            Últimos 3 meses
          </button>
          <button
            onClick={() => handleQuickSelect('thisYear')}
            className="px-4 py-2 bg-gray-50 rounded-lg text-paragraph-sm text-secondary-900 hover:bg-gray-100 transition-colors"
          >
            Este ano
          </button>
        </div>
      </div>

      <div className="border-t border-stroke-4 pt-4">
        {isMobile ? (
          <Calendar month={currentMonth} />
        ) : (
          <div className="flex gap-6">
            <Calendar month={currentMonth} />
            <Calendar
              month={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-paragraph-sm text-secondary-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-secondary-900 text-surface-500 rounded-lg text-paragraph-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 lg:py-2 bg-gray-50 border border-stroke-4 rounded-full text-paragraph-sm text-secondary-900 hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{formatDateRange(dateRange)}</span>
      </button>

      {/* Desktop: Popover */}
      {!isMobile && isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-2 right-0"
        >
          <CalendarContent />
        </div>
      )}

      {/* Mobile: Modal Fullscreen */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div
            ref={popoverRef}
            className="w-full bg-surface-500 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-sm font-bold text-secondary-900">Selecionar Período</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
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
            <CalendarContent />
          </div>
        </div>
      )}
    </div>
  );
};
