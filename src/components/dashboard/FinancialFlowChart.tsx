import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Dados mock para 7 meses
const mockFinancialFlowData = [
  { month: 'Jan', receitas: 5000, despesas: 3200 },
  { month: 'Fev', receitas: 4800, despesas: 3400 },
  { month: 'Mar', receitas: 5200, despesas: 3100 },
  { month: 'Abr', receitas: 5500, despesas: 3800 },
  { month: 'Mai', receitas: 5300, despesas: 3600 },
  { month: 'Jun', receitas: 5800, despesas: 3900 },
  { month: 'Jul', receitas: 6000, despesas: 4100 },
];

// Formatação compacta para valores monetários no eixo Y
const formatYAxisTick = (value: number) => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return `R$ ${value}`;
};

// Componente de tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-500 border border-stroke-4 rounded-lg p-4 shadow-card">
        <p className="text-paragraph-sm font-bold text-secondary-900 mb-2">{label}</p>
        <p className="text-paragraph-sm text-green-500">
          Receitas: R$ {payload[0]?.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-paragraph-sm text-secondary-900">
          Despesas: R$ {payload[1]?.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export const FinancialFlowChart = () => {
  return (
    <div className="bg-surface-500 border border-stroke-4 rounded-2xl p-6 shadow-card">
      {/* Header com título e legenda */}
      <div className="flex items-center justify-between mb-6">
        {/* Título com ícone */}
        <div className="flex items-center gap-3">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-heading-sm font-bold text-secondary-900">Fluxo Financeiro</h3>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-paragraph-sm text-secondary-900">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-900 rounded-full"></div>
            <span className="text-paragraph-sm text-secondary-900">Despesas</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[300px] bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockFinancialFlowData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            {/* Grid sutil */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              strokeOpacity={0.3}
              vertical={false}
            />

            {/* Eixos */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatYAxisTick}
              dx={-10}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Área de Receitas */}
            <defs>
              <linearGradient id="receitasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4E703" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#C4E703" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="despesasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080B12" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#080B12" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="receitas"
              stroke="#C4E703"
              strokeWidth={3}
              fill="url(#receitasGradient)"
            />

            {/* Área de Despesas */}
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="#080B12"
              strokeWidth={3}
              fill="url(#despesasGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};