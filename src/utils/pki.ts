import type { Ticket } from '../types';

export function calculatePKI(tickets: Ticket[]) {
  if (tickets.length === 0) {
    return {
      resolutionRate: 1,
      delaiRespectRate: 1,
      reopenRate: 0,
      globalPKI: 1
    };
  }

  // Taux de résolution
  const resolvedTickets = tickets.filter(t => t.status === 'CLOTURE');
  const resolutionRate = resolvedTickets.length / tickets.length;

  // Taux de respect des délais
  const delaiRespectRate = resolvedTickets.filter(t => t.delaiRespect).length / 
    (resolvedTickets.length || 1);

  // Taux de réouverture
  const reopenRate = tickets.filter(t => t.reopened).length / tickets.length;

  // PKI Global (moyenne pondérée)
  const globalPKI = (
    resolutionRate * 0.4 + 
    delaiRespectRate * 0.4 + 
    (1 - reopenRate) * 0.2
  );

  return {
    resolutionRate,
    delaiRespectRate,
    reopenRate,
    globalPKI
  };
}