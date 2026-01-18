/**
 * Utilitários para validação de dados
 */

/**
 * Valida formato de email usando regex
 * @param email - String de email a ser validada
 * @returns True se o email for válido
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida CPF brasileiro (apenas estrutura, sem consulta)
 * @param cpf - String do CPF (apenas números ou formatado)
 * @returns True se o CPF for válido estruturalmente
 * @example
 * isValidCPF("123.456.789-00") // false (CPF de exemplo)
 * isValidCPF("111.111.111-11") // false (CPF inválido)
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se não é uma sequência de números iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  // Verifica se os dígitos calculados batem com os informados
  return (
    parseInt(cleanCPF[9]) === firstDigit &&
    parseInt(cleanCPF[10]) === secondDigit
  );
};

/**
 * Valida se uma data é válida e não é futura (opcional)
 * @param date - Objeto Date a ser validado
 * @param allowFuture - Se deve permitir datas futuras (padrão: false)
 * @returns True se a data for válida
 * @example
 * isValidDate(new Date('2024-01-15')) // true
 * isValidDate(new Date('2024-01-15'), false) // true (se hoje for antes)
 */
export const isValidDate = (date: Date, allowFuture: boolean = false): boolean => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return false;

  if (!allowFuture) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    if (checkDate > now) return false;
  }

  return true;
};

/**
 * Valida se um valor é um número positivo maior que zero
 * @param value - Valor a ser validado
 * @returns True se for um número positivo > 0
 * @example
 * isPositiveNumber(10.5) // true
 * isPositiveNumber(-5) // false
 * isPositiveNumber("10") // false
 */
export const isPositiveNumber = (value: any): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return typeof num === 'number' && !isNaN(num) && num > 0;
};

/**
 * Valida se uma string tem comprimento mínimo
 * @param text - String a ser validada
 * @param minLength - Comprimento mínimo (padrão: 1)
 * @returns True se atender ao critério
 * @example
 * hasMinLength("Hello", 3) // true
 * hasMinLength("Hi", 5) // false
 */
export const hasMinLength = (text: string, minLength: number = 1): boolean => {
  return typeof text === 'string' && text.trim().length >= minLength;
};

/**
 * Valida se uma string tem comprimento máximo
 * @param text - String a ser validada
 * @param maxLength - Comprimento máximo
 * @returns True se atender ao critério
 * @example
 * hasMaxLength("Hello", 10) // true
 * hasMaxLength("This is a very long text", 10) // false
 */
export const hasMaxLength = (text: string, maxLength: number): boolean => {
  return typeof text === 'string' && text.trim().length <= maxLength;
};

/**
 * Valida se um valor está dentro de um intervalo
 * @param value - Valor a ser validado
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 * @returns True se estiver no intervalo
 * @example
 * isInRange(5, 1, 10) // true
 * isInRange(15, 1, 10) // false
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Valida se uma string contém apenas números
 * @param text - String a ser validada
 * @returns True se conter apenas dígitos
 * @example
 * isNumeric("12345") // true
 * isNumeric("123a45") // false
 */
export const isNumeric = (text: string): boolean => {
  return /^\d+$/.test(text);
};

/**
 * Valida se uma string é um telefone brasileiro válido
 * @param phone - String do telefone
 * @returns True se for um telefone válido
 * @example
 * isValidPhone("(11) 99999-9999") // true
 * isValidPhone("11999999999") // true
 */
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Aceita telefones com 10 ou 11 dígitos (com/sem nono dígito)
  return /^(\d{10}|\d{11})$/.test(cleanPhone);
};

/**
 * Valida força de senha (básica)
 * @param password - String da senha
 * @returns Objeto com validade e critérios atendidos
 * @example
 * validatePassword("MyPass123!") // { isValid: true, score: 4, criteria: {...} }
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
  };
} => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;
  const isValid = score >= 4; // Pelo menos 4 critérios

  return {
    isValid,
    score,
    criteria,
  };
};