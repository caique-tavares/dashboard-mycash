import { BalanceCard } from '../components/dashboard/BalanceCard';
import { IncomeSummaryCard } from '../components/dashboard/IncomeSummaryCard';
import { ExpenseSummaryCard } from '../components/dashboard/ExpenseSummaryCard';
import { ExpenseCard } from '../components/dashboard/ExpenseCard';
import { FinancialFlowChart } from '../components/dashboard/FinancialFlowChart';
import { TransactionsTable } from '../components/dashboard/TransactionsTable';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';

export const Dashboard = () => {
  return (
    <div>
      <div className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-900">Dashboard</h1>
      </div>

      {/* Header com controles de filtro */}
      <div className="mb-6 md:mb-8 lg:mb-10">
        <DashboardHeader />
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="space-y-4 md:space-y-6 lg:space-y-8 mb-6 md:mb-8 lg:mb-10">
        {/* Despesas - cards responsivos */}
        <div className="grid-card">
          <ExpenseCard />
        </div>

        {/* Segunda linha: cards de resumo - 1 coluna mobile, 3 colunas desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="grid-card">
            <BalanceCard />
          </div>
          <div className="grid-card">
            <IncomeSummaryCard />
          </div>
          <div className="grid-card md:col-span-2 lg:col-span-1">
            <ExpenseSummaryCard />
          </div>
        </div>

        {/* Terceira linha: Gráfico de Fluxo Financeiro */}
        <div className="grid-card">
          <FinancialFlowChart />
        </div>

        {/* Quarta linha: Tabela de Transações */}
        <div className="grid-card">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};