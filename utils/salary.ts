/**
 * Утиліти для роботи з зарплатою
 */

export function extractSalary(salary?: string): number {
  if (!salary) return 0;
  const match = salary.match(/[\d\s]+/);
  if (!match) return 0;
  const num = parseInt(match[0].replace(/\s/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(amount);
}
