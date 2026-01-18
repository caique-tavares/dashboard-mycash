import { useFinancial } from '../../contexts/FinancialContext';
import { formatCurrency } from '../../utils/currency.utils';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export const ExpenseSummaryCard = () => {
  const { calculateExpensesForPeriod } = useFinancial();
  const totalExpenses = calculateExpensesForPeriod();

  return (
    <div className="bg-surface-500 border border-stroke-4 rounded-2xl p-6 shadow-card flex flex-col justify-center align-self-stretch gap-8">
      {/* Ícone de seta para cima */}
      <div className="w-6 h-6 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>

      {/* Container de texto */}
      <div className="flex flex-col justify-center align-self-stretch gap-1">
        {/* Label */}
        <p className="text-paragraph-lg text-secondary-900">Despesas</p>

        {/* Valor formatado */}
        <h2 className="text-heading-md font-bold text-red-500">
          <AnimatedCounter
            value={totalExpenses}
            formatter={(val) => formatCurrency(val)}
          />
        </h2>
      </div>
    </div>
  );
};