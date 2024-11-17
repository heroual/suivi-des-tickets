import { useEffect, useCallback } from 'react';
import { logoutUser } from '../services/firebase';

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useAutoSignout() {
  let timeoutId: NodeJS.Timeout;

  const resetTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(async () => {
      await logoutUser();
    }, TIMEOUT_DURATION);
  }, []);

  useEffect(() => {
    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const handleUserActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetTimer]);
}