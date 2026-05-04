import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function currency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

export function dateLabel(value) {
  if (!value) return '-';
  return format(typeof value === 'string' ? parseISO(value) : value, 'dd/MM/yyyy', { locale: ptBR });
}

export function monthName(month, year) {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy', { locale: ptBR });
}
