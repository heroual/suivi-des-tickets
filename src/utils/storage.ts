import { Ticket } from '../types';

const STORAGE_KEY = 'sav-tickets';

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Error saving tickets:', error);
  }
}

export function loadTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const tickets = JSON.parse(data);
      return tickets.map((ticket: any) => ({
        ...ticket,
        dateCreation: new Date(ticket.dateCreation),
        dateCloture: ticket.dateCloture ? new Date(ticket.dateCloture) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading tickets:', error);
  }
  return [];
}