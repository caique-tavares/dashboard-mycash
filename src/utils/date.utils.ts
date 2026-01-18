/**
 * Utilitários para formatação e manipulação de datas
 */

/**
 * Formata uma data no formato brasileiro padrão
 * @param date - A data a ser formatada
 * @returns String formatada como "DD/MM/AAAA"
 * @example
 * formatDate(new Date('2024-01-15')) // "15/01/2024"
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data no formato longo e descritivo
 * @param date - A data a ser formatada
 * @returns String formatada como "15 de Janeiro de 2024"
 * @example
 * formatDateLong(new Date('2024-01-15')) // "15 de Janeiro de 2024"
 */
export const formatDateLong = (date: Date): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
};

/**
 * Formata um intervalo de datas
 * @param startDate - Data inicial do intervalo
 * @param endDate - Data final do intervalo
 * @returns String formatada como "01 jan - 31 jan, 2024"
 * @example
 * formatDateRange(new Date('2024-01-01'), new Date('2024-01-31')) // "01 jan - 31 jan, 2024"
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];

  const startDay = String(startDate.getDate()).padStart(2, '0');
  const startMonth = months[startDate.getMonth()];
  const startYear = startDate.getFullYear();

  const endDay = String(endDate.getDate()).padStart(2, '0');
  const endMonth = months[endDate.getMonth()];
  const endYear = endDate.getFullYear();

  if (startYear === endYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
  } else {
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  }
};

/**
 * Formata uma data de forma relativa ao presente
 * @param date - A data a ser formatada
 * @returns String relativa como "Hoje", "Ontem", "Há 3 dias"
 * @example
 * formatRelativeDate(new Date()) // "Hoje"
 * formatRelativeDate(new Date(Date.now() - 86400000)) // "Ontem"
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoje';
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays < 7) {
    return `Há ${diffDays} dias`;
  } else if (diffDays < 14) {
    return 'Há 1 semana';
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Há ${weeks} semanas`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Há ${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
};

/**
 * Verifica se uma data é válida
 * @param date - A data a ser validada
 * @returns True se a data for válida
 * @example
 * isValidDate(new Date('2024-01-15')) // true
 * isValidDate(new Date('invalid')) // false
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Cria uma data a partir de uma string no formato DD/MM/AAAA
 * @param dateString - String no formato "DD/MM/AAAA"
 * @returns Objeto Date ou null se inválido
 * @example
 * parseDateString("15/01/2024") // Date object
 */
export const parseDateString = (dateString: string): Date | null => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês começa em 0
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  return isValidDate(date) ? date : null;
};