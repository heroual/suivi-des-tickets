import React from 'react';
import { PartyPopper, ThumbsDown } from 'lucide-react';

interface PKIResultProps {
  pki: number;
  label: string;
  details?: {
    total: number;
    onTime: number;
  };
}

export default function PKIResult({ pki, label, details }: PKIResultProps) {
  const isSuccess = pki >= 75;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="flex items-center space-x-3 mt-2">
        <div className="text-2xl font-bold text-blue-600">
          {pki > 0 ? `${pki.toFixed(1)}%` : 'Non atteint (<75%)'}
        </div>
        <div className={`transform transition-transform duration-500 ${isSuccess ? 'animate-bounce' : 'animate-shake'}`}>
          {isSuccess ? (
            <PartyPopper className="w-6 h-6 text-green-500" />
          ) : (
            <ThumbsDown className="w-6 h-6 text-red-500" />
          )}
        </div>
      </div>
      {details && (
        <div className="text-sm text-gray-500 mt-2">
          Total: {details.total} | Dans les délais: {details.onTime}
        </div>
      )}
      {isSuccess && (
        <div className="text-sm text-green-600 mt-2 font-medium">
          Félicitations ! Objectif PKI atteint ! 🎉
        </div>
      )}
    </div>
  );
}