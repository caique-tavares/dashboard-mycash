/**
 * Utilitários para geração de IDs únicos
 */

/**
 * Gera um ID único usando timestamp e randomização
 * @returns String única baseada em timestamp e números aleatórios
 * @example
 * generateUniqueId() // "txn_1703123456789_123456"
 */
export const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `id_${timestamp}_${random}`;
};

/**
 * Gera um ID único para transações
 * @returns ID formatado para transações
 * @example
 * generateTransactionId() // "txn_1703123456789_123456"
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `txn_${timestamp}_${random}`;
};

/**
 * Gera um ID único para contas bancárias
 * @returns ID formatado para contas
 * @example
 * generateAccountId() // "acc_1703123456789_123456"
 */
export const generateAccountId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `acc_${timestamp}_${random}`;
};

/**
 * Gera um ID único para cartões de crédito
 * @returns ID formatado para cartões
 * @example
 * generateCardId() // "card_1703123456789_123456"
 */
export const generateCardId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `card_${timestamp}_${random}`;
};

/**
 * Gera um ID único para membros da família
 * @returns ID formatado para membros
 * @example
 * generateMemberId() // "mbr_1703123456789_123456"
 */
export const generateMemberId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `mbr_${timestamp}_${random}`;
};

/**
 * Gera um ID único para metas/finanças
 * @returns ID formatado para metas
 * @example
 * generateGoalId() // "goal_1703123456789_123456"
 */
export const generateGoalId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `goal_${timestamp}_${random}`;
};

/**
 * Gera um UUID v4 simples (fallback se crypto.randomUUID não estiver disponível)
 * @returns UUID v4 formatado
 * @example
 * generateUUID() // "123e4567-e89b-12d3-a456-426614174000"
 */
export const generateUUID = (): string => {
  // Tenta usar crypto.randomUUID se disponível (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: implementação simples de UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Gera um código alfanumérico curto para uso em URLs ou referências
 * @param length - Comprimento do código (padrão: 8)
 * @returns String alfanumérica maiúscula
 * @example
 * generateShortCode(6) // "A1B2C3"
 */
export const generateShortCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Gera um código de referência único baseado em timestamp
 * @returns Código de referência formatado
 * @example
 * generateReferenceCode() // "REF240115123456"
 */
export const generateReferenceCode = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') +
               String(now.getMinutes()).padStart(2, '0') +
               String(now.getSeconds()).padStart(2, '0');

  return `REF${year}${month}${day}${time}`;
};