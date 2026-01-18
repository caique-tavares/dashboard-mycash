import { useFinancial } from '../../contexts/FinancialContext';
import { DonutChart } from '../ui/DonutChart';
import { formatCurrency } from '../../utils/currency.utils';

export const ExpenseCard = () => {
  const { transactions, calculateExpensesForPeriod } = useFinancial();
  const totalExpenses = calculateExpensesForPeriod();

  // Filtrar transações de despesa do período atual
  const currentDate = new Date();
  const expenseTransactions = transactions.filter(t =>
    t.type === 'expense' &&
    t.date.getMonth() === currentDate.getMonth() &&
    t.date.getFullYear() === currentDate.getFullYear()
  );

  // Calcular as principais despesas e suas porcentagens
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenses = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4); // Mostrar até as 4 principais

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {topExpenses.map((expense) => (
        <div
          key={expense.category}
          className="bg-surface-500 border border-stroke-4 rounded-2xl p-4 shadow-card w-full min-h-[140px] flex flex-col"
        >
          <div className="flex flex-col items-center gap-2">
            {/* Gráfico e Porcentagem */}
            <div className="flex flex-col items-center gap-1">
              <DonutChart
                percentage={expense.percentage}
                size={56}
                color="#E61E32"
                backgroundColor="#E7E8EA"
              />
              <span className="text-paragraph-xs text-secondary-900 font-medium">
                {expense.percentage}%
              </span>
            </div>

            {/* Informações da despesa */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-paragraph-sm text-secondary-900 font-medium">
                {expense.category}
              </h3>
              <p className="text-heading-xs font-bold text-secondary-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};