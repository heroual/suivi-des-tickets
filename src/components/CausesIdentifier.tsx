import React, { useState } from 'react';
import { Brain, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';
import type { CauseType } from '../types';

interface Cause {
  id: string;
  type: CauseType;
  description: string;
  symptoms: string[];
  solutions: string[];
  preventiveMeasures: string[];
}

export default function CausesIdentifier() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);

  const causes: Cause[] = [
    {
      id: '1',
      type: 'Technique',
      description: 'Dégradation du signal optique',
      symptoms: [
        'Perte de puissance optique',
        'Instabilité de la connexion',
        'Erreurs CRC fréquentes'
      ],
      solutions: [
        'Vérification des connecteurs optiques',
        'Mesure de puissance avec OTDR',
        'Remplacement du câble si nécessaire'
      ],
      preventiveMeasures: [
        'Inspection régulière des points de connexion',
        'Maintenance préventive trimestrielle',
        'Formation continue des techniciens'
      ]
    },
    {
      id: '2',
      type: 'Casse',
      description: 'Rupture de câble fibre optique',
      symptoms: [
        'Perte totale de connexion',
        'Absence de signal optique',
        'Alarmes équipements actifs'
      ],
      solutions: [
        'Localisation précise de la rupture',
        'Remplacement du tronçon endommagé',
        'Test de continuité après réparation'
      ],
      preventiveMeasures: [
        'Cartographie des zones à risque',
        'Protection mécanique renforcée',
        'Surveillance des travaux tiers'
      ]
    },
    {
      id: '3',
      type: 'Client',
      description: 'Configuration incorrecte ONT',
      symptoms: [
        'Authentification échouée',
        'Services non fonctionnels',
        'LED d\'état anormales'
      ],
      solutions: [
        'Reset configuration usine',
        'Mise à jour firmware',
        'Reconfiguration des paramètres'
      ],
      preventiveMeasures: [
        'Documentation des configurations',
        'Formation des utilisateurs',
        'Vérification post-installation'
      ]
    }
  ];

  const filteredCauses = causes.filter(cause =>
    cause.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cause.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cause.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Identificateur de Causes</h2>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Rechercher par symptômes, type ou description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCauses.map((cause) => (
          <div
            key={cause.id}
            className={`cursor-pointer rounded-lg p-6 transition-all duration-200 ${
              selectedCause?.id === cause.id
                ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]'
                : 'hover:shadow-md'
            } ${
              cause.type === 'Technique' ? 'bg-blue-50' :
              cause.type === 'Casse' ? 'bg-red-50' :
              'bg-green-50'
            }`}
            onClick={() => setSelectedCause(cause.id === selectedCause?.id ? null : cause)}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                cause.type === 'Technique' ? 'bg-blue-100 text-blue-800' :
                cause.type === 'Casse' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {cause.type}
              </span>
              {cause.type === 'Technique' ? (
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              ) : cause.type === 'Casse' ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{cause.description}</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Symptômes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {cause.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCause?.id === cause.id && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Solutions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cause.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Mesures préventives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cause.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCauses.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune cause trouvée pour votre recherche</p>
        </div>
      )}
    </div>
  );
}