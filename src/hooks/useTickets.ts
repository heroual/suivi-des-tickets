import { useState, useEffect, useCallback } from 'react';
import { getTickets } from '../services/firebase';
import type { Ticket } from '../types';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Erreur lors du chargement des tickets. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();

    // Set up real-time updates
    const unsubscribe = getTickets()
      .then(() => {
        // Initial load successful
      })
      .catch((error) => {
        console.error('Error setting up real-time updates:', error);
      });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [loadTickets]);

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