import type { Ticket } from '../types';

export function calculatePKI(tickets: Ticket[]) {
  // Filter only closed tickets
  const closedTickets = tickets.filter(t => t.status === 'CLOTURE' && t.dateCloture);
  
  if (closedTickets.length === 0) {
    return {
      resolutionRate: 1,
      delaiRespectRate: 1,
      reopenRate: 0,
      globalPKI: 0
    };
  }

  const totalClosedTickets = closedTickets.length;
  const ticketsInTime = closedTickets.filter(t => t.delaiRespect).length;
  
  // Calculate PKI based on closed tickets
  const pki = (ticketsInTime / totalClosedTickets) * 100;
  const finalPKI = pki >= 75 ? pki : 0;

  return {
    resolutionRate: ticketsInTime / totalClosedTickets,
    delaiRespectRate: ticketsInTime / totalClosedTickets,
    reopenRate: closedTickets.filter(t => t.reopened).length / totalClosedTickets,
    globalPKI: finalPKI
  };
}

export function getTicketsByClosureDate(tickets: Ticket[], startDate: Date, endDate: Date) {
  return tickets.filter(ticket => 
    ticket.status === 'CLOTURE' &&
    ticket.dateCloture &&
    ticket.dateCloture >= startDate &&
    ticket.dateCloture <= endDate
  );
}

export function getDailyClosedTickets(tickets: Ticket[], date: Date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return getTicketsByClosureDate(tickets, dayStart, dayEnd);
}

export function getMonthlyClosedTickets(tickets: Ticket[], date: Date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return getTicketsByClosureDate(tickets, monthStart, monthEnd);
}