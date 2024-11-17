import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface AutoSignoutAlertProps {
  remainingTime: number;
}

export default function AutoSignoutAlert({ remainingTime }: AutoSignoutAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (remainingTime <= 60) { // Show warning in last 60 seconds
      setVisible(true);
    }
    return () => setVisible(false);
  }, [remainingTime]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Déconnexion automatique dans {Math.ceil(remainingTime)} secondes
          </p>
        </div>
      </div>
    </div>
  );
}