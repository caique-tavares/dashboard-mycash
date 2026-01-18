import { useFinancial } from '../../contexts/FinancialContext';
import { formatCurrency } from '../../utils/currency.utils';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export const BalanceCard = () => {
  const { calculateTotalBalance } = useFinancial();
  const totalBalance = calculateTotalBalance();

  return (
    <div className="bg-surface-500 border border-stroke-4 rounded-2xl p-6 shadow-card card-hover flex flex-col justify-center align-self-stretch gap-8">
      {/* Ícone de cifrão */}
      <div className="w-6 h-6 flex items-center justify-center">
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
            d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          />
        </svg>
      </div>

      {/* Container de texto */}
      <div className="flex flex-col justify-center align-self-stretch gap-1">
        {/* Label */}
        <p className="text-paragraph-lg text-secondary-900">Saldo total</p>

        {/* Valor formatado */}
        <h2 className="text-heading-md font-bold text-blue-500">
          <AnimatedCounter
            value={totalBalance}
            formatter={(val) => formatCurrency(val)}
          />
        </h2>
      </div>
    </div>
  );
};