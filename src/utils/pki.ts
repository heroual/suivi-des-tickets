import type { Ticket } from '../types';

export function calculatePKI(tickets: Ticket[]) {
  if (tickets.length === 0) {
    return {
      resolutionRate: 1,
      delaiRespectRate: 1,
      reopenRate: 0,
      globalPKI: 0
    };
  }

  const totalTickets = tickets.length;
  const ticketsInTime = tickets.filter(t => t.delaiRespect).length;
  
  // Nouveau calcul PKI: (tickets dans les délais / total tickets) * 100
  const pki = (ticketsInTime / totalTickets) * 100;
  
  // On retourne 0 si le PKI est inférieur à 75%
  const finalPKI = pki >= 75 ? pki : 0;

  return {
    resolutionRate: ticketsInTime / totalTickets,
    delaiRespectRate: ticketsInTime / totalTickets,
    reopenRate: tickets.filter(t => t.reopened).length / totalTickets,
    globalPKI: finalPKI
  };
}