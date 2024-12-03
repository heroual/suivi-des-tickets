import { useState, useEffect } from 'react';
import { getTickets } from '../services/firebase';
import type { Ticket } from '../types';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
      setError(null);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = () => {
    loadTickets();
  };

  return {
    tickets,
    loading,
    error,
    refreshTickets
  };
}