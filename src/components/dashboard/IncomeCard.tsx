import { useFinancial } from '../../contexts/FinancialContext';
import { DonutChart } from '../ui/DonutChart';
import { formatCurrency } from '../../utils/currency.utils';

export const IncomeCard = () => {
  const { transactions, calculateIncomeForPeriod } = useFinancial();
  const totalIncome = calculateIncomeForPeriod();

  // Filtrar transações de receita do período atual
  const currentDate = new Date();
  const incomeTransactions = transactions.filter(t =>
    t.type === 'income' &&
    t.date.getMonth() === currentDate.getMonth() &&
    t.date.getFullYear() === currentDate.getFullYear()
  );

  // Calcular as principais receitas e suas porcentagens
  const categoryTotals = incomeTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const topIncomes = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalIncome) * 100)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Mostrar apenas as 3 principais

  return (
    <div className="grid grid-cols-2 gap-4">
      {topIncomes.map((income) => (
        <div
          key={income.category}
          className="bg-surface-500 border border-stroke-4 rounded-2xl p-4 shadow-card"
        >
          <div className="flex flex-col items-center gap-2">
            {/* Gráfico e Porcentagem */}
            <div className="flex flex-col items-center gap-1">
              <DonutChart
                percentage={income.percentage}
                size={56}
                color="#15BE78"
                backgroundColor="#E7E8EA"
              />
              <span className="text-paragraph-xs text-secondary-900 font-medium">
                {income.percentage}%
              </span>
            </div>

            {/* Informações da receita */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-paragraph-sm text-secondary-900 font-medium">
                {income.category}
              </h3>
              <p className="text-heading-xs font-bold text-secondary-900">
                {formatCurrency(income.amount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};