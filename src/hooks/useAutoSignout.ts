import { useState, useEffect, useCallback } from 'react';
import { logoutUser } from '../services/firebase';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useAutoSignout() {
  const [remainingTime, setRemainingTime] = useState(INACTIVITY_TIMEOUT);
  let timeoutId: NodeJS.Timeout;
  let intervalId: NodeJS.Timeout;

  const resetTimer = useCallback(() => {
    setRemainingTime(INACTIVITY_TIMEOUT);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Set new timeout for auto logout
    timeoutId = setTimeout(async () => {
      await logoutUser();
    }, INACTIVITY_TIMEOUT);

    // Update remaining time every second
    intervalId = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1000));
    }, 1000);
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
      if (intervalId) {
        clearInterval(intervalId);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetTimer]);

  return remainingTime;
}