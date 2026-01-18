/**
 * Utilitários para formatação de valores monetários
 */

/**
 * Formata um número como moeda brasileira
 * @param value - O valor numérico a ser formatado
 * @returns String formatada como moeda brasileira (ex: "R$ 1.234,56")
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata um número grande de forma compacta para gráficos
 * @param value - O valor numérico a ser formatado
 * @returns String formatada de forma compacta (ex: "R$ 2,5k", "R$ 1,2M")
 * @example
 * formatCompactCurrency(2500) // "R$ 2,5k"
 * formatCompactCurrency(1200000) // "R$ 1,2M"
 */
export const formatCompactCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return formatter.format(value);
};

/**
 * Converte string de input do usuário em número limpo
 * Remove símbolos monetários, pontos de milhar e converte vírgula em ponto
 * @param input - A string de input do usuário (ex: "R$ 1.234,56")
 * @returns O valor numérico limpo
 * @example
 * parseCurrencyInput("R$ 1.234,56") // 1234.56
 * parseCurrencyInput("1,50") // 1.50
 */
export const parseCurrencyInput = (input: string): number => {
  // Remove "R$", espaços e outros símbolos
  let cleanInput = input
    .replace(/R\$\s?/g, '') // Remove "R$"
    .replace(/\./g, '') // Remove pontos de milhar
    .replace(',', '.') // Troca vírgula por ponto decimal
    .trim();

  const parsed = parseFloat(cleanInput);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formata um valor para exibição em input (converte ponto para vírgula)
 * @param value - O valor numérico
 * @returns String formatada para input (ex: "1234,56")
 * @example
 * formatCurrencyInput(1234.56) // "1234,56"
 */
export const formatCurrencyInput = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};