import React from 'react';
import { PartyPopper, ThumbsDown, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

interface PKIResultProps {
  pki: number;
  label: string;
  details?: {
    total: number;
    onTime: number;
  };
}

export default function PKIResult({ pki, label, details }: PKIResultProps) {
  if (!details) return null;
  
  const isSuccess = pki >= 75;
  const isWarning = pki > 0 && pki < 75;
  const horsDelai = details.total - details.onTime;
  const tauxRespectDelais = (details.onTime / details.total) * 100;
  
  const getAdvice = () => {
    if (!details) return [];
    
    const latePercentage = (horsDelai / details.total) * 100;
    const advice = [];
    
    if (latePercentage >= 30) {
      advice.push("Prioriser les tickets les plus anciens");
      advice.push("Mettre en place un système d'alerte pour les tickets proches de l'échéance");
    }
    if (horsDelai > 5) {
      advice.push("Répartir équitablement la charge de travail entre les techniciens");
      advice.push("Identifier les causes récurrentes des retards");
    }
    if (pki < 50) {
      advice.push("Analyser les pics d'activité pour mieux anticiper");
      advice.push("Renforcer le suivi quotidien des tickets");
    }
    
    return advice;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start">
        <div className="font-semibold text-xl text-gray-900">{label}</div>
        <div className={`transform transition-transform duration-500 ${isSuccess ? 'animate-bounce' : 'animate-shake'}`}>
          {isSuccess ? (
            <PartyPopper className="w-6 h-6 text-green-500" />
          ) : (
            <ThumbsDown className="w-6 h-6 text-red-500" />
          )}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* PKI Score */}
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-5 h-5 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} />
          <div className="text-3xl font-bold text-blue-600">
            {pki > 0 ? `${pki.toFixed(1)}%` : 'Non atteint (<75%)'}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700 font-medium">Total Tickets</div>
            <div className="text-2xl font-bold text-blue-900">{details.total}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-700 font-medium">Dans les Délais</div>
            <div className="text-2xl font-bold text-green-900">{details.onTime}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-700 font-medium">Hors Délais</div>
            <div className="text-2xl font-bold text-red-900">{horsDelai}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-sm text-amber-700 font-medium">Taux Respect Délais</div>
            <div className="text-2xl font-bold text-amber-900">
              {tauxRespectDelais.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Status Message */}
        {isSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <PartyPopper className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Félicitations ! Objectif PKI atteint ! Continuez sur cette lancée ! 🎉
                </p>
              </div>
            </div>
          </div>
        )}

        {isWarning && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Proche de l'objectif ! Encore un petit effort pour atteindre les 75% !
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Improvement Advice */}
        {details.total > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h4 className="font-medium text-gray-900">Conseils d'amélioration</h4>
            </div>
            <ul className="space-y-2">
              {getAdvice().map((advice, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span className="text-sm text-gray-600">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}