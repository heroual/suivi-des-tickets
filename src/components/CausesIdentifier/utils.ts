import type { CauseType } from '../../types';
import type { CauseTypeStyles } from './types';

export function getCauseTypeStyles(type: CauseType): CauseTypeStyles {
  switch (type) {
    case 'Technique':
      return {
        bgColor: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600'
      };
    case 'Casse':
      return {
        bgColor: 'bg-red-50',
        badgeColor: 'bg-red-100 text-red-800',
        iconColor: 'text-red-600'
      };
    case 'Client':
      return {
        bgColor: 'bg-green-50',
        badgeColor: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600'
      };
  }
}

export function filterCauses(causes: Cause[], searchQuery: string): Cause[] {
  const search = searchQuery.toLowerCase();
  return causes.filter(cause =>
    cause.description.toLowerCase().includes(search) ||
    cause.type.toLowerCase().includes(search) ||
    cause.symptoms.some(s => s.toLowerCase().includes(search))
  );
}