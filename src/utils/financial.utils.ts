/**
 * Utilitários para cálculos financeiros
 */

/**
 * Calcula o percentual de um valor parcial em relação ao total
 * @param partial - Valor parcial
 * @param total - Valor total
 * @returns Percentual com uma casa decimal (0 se divisão por zero)
 * @example
 * calculatePercentage(250, 1000) // 25.0
 * calculatePercentage(0, 1000) // 0.0
 */
export const calculatePercentage = (partial: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((partial / total) * 1000) / 10; // Uma casa decimal
};

/**
 * Calcula a diferença entre dois valores
 * @param current - Valor atual
 * @param previous - Valor anterior
 * @returns Objeto com diferença absoluta e percentual de variação
 * @example
 * calculateDifference(1200, 1000) // { difference: 200, percentage: 20.0, isIncrease: true }
 */
export const calculateDifference = (
  current: number,
  previous: number
): { difference: number; percentage: number; isIncrease: boolean } => {
  const difference = current - previous;
  const percentage = previous !== 0 ? Math.round((difference / Math.abs(previous)) * 1000) / 10 : 0;
  const isIncrease = difference > 0;

  return {
    difference: Math.abs(difference),
    percentage: Math.abs(percentage),
    isIncrease,
  };
};

/**
 * Calcula o valor de cada parcela de um valor total
 * @param totalValue - Valor total a ser parcelado
 * @param installments - Número de parcelas
 * @returns Valor de cada parcela arredondado para 2 casas decimais
 * @example
 * calculateInstallmentValue(1000, 10) // 100.00
 */
export const calculateInstallmentValue = (totalValue: number, installments: number): number => {
  if (installments <= 0) return 0;
  return Math.round((totalValue / installments) * 100) / 100;
};

/**
 * Calcula o valor futuro com juros compostos
 * @param principal - Valor principal
 * @param rate - Taxa de juros mensal (em decimal, ex: 0.02 para 2%)
 * @param time - Tempo em meses
 * @returns Valor futuro
 * @example
 * calculateCompoundInterest(1000, 0.02, 12) // 1268.24
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number
): number => {
  return principal * Math.pow(1 + rate, time);
};

/**
 * Calcula o valor presente (desconto)
 * @param futureValue - Valor futuro
 * @param rate - Taxa de desconto mensal (em decimal)
 * @param time - Tempo em meses
 * @returns Valor presente
 * @example
 * calculatePresentValue(1268.24, 0.02, 12) // 1000.00
 */
export const calculatePresentValue = (
  futureValue: number,
  rate: number,
  time: number
): number => {
  return futureValue / Math.pow(1 + rate, time);
};

/**
 * Calcula o saldo devedor de um empréstimo/parcelamento
 * @param principal - Valor principal
 * @param rate - Taxa de juros mensal (em decimal)
 * @param time - Tempo em meses
 * @param payments - Número de pagamentos já feitos
 * @returns Saldo devedor restante
 */
export const calculateOutstandingBalance = (
  principal: number,
  rate: number,
  time: number,
  payments: number
): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, rate, time);
  const remainingPayments = time - payments;

  if (remainingPayments <= 0) return 0;

  return calculatePresentValue(monthlyPayment * remainingPayments, rate, remainingPayments);
};

/**
 * Calcula o valor da prestação mensal (fórmula Price)
 * @param principal - Valor principal
 * @param rate - Taxa de juros mensal (em decimal)
 * @param time - Número de meses
 * @returns Valor da prestação mensal
 */
export const calculateMonthlyPayment = (
  principal: number,
  rate: number,
  time: number
): number => {
  if (rate === 0) return principal / time;

  return principal * (rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
};

/**
 * Formata um número como percentual
 * @param value - Valor numérico (ex: 0.25 para 25%)
 * @param decimals - Número de casas decimais
 * @returns String formatada como percentual
 * @example
 * formatPercentage(0.25) // "25,0%"
 * formatPercentage(0.256, 2) // "25,60%"
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};