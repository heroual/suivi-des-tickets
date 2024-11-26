import { useState } from 'react';
import type { Cause } from './types';
import { filterCauses } from './utils';

const initialCauses: Cause[] = [
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

export default function useCauses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);

  const filteredCauses = filterCauses(initialCauses, searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    selectedCause,
    setSelectedCause,
    filteredCauses
  };
}