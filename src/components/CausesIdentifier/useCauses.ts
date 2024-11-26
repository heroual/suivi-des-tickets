import { useState } from 'react';
import { nanoid } from 'nanoid';
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
  const [causes, setCauses] = useState<Cause[]>(initialCauses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCause, setEditingCause] = useState<Cause | null>(null);

  const filteredCauses = filterCauses(causes, searchQuery);

  const handleAddCause = (causeData: Omit<Cause, 'id'>) => {
    const newCause: Cause = {
      ...causeData,
      id: nanoid()
    };
    setCauses(prev => [...prev, newCause]);
    setShowForm(false);
  };

  const handleUpdateCause = (causeData: Omit<Cause, 'id'>) => {
    if (!editingCause) return;
    
    setCauses(prev => prev.map(cause => 
      cause.id === editingCause.id ? { ...causeData, id: cause.id } : cause
    ));
    setShowForm(false);
    setEditingCause(null);
  };

  const handleDeleteCause = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette cause ?')) {
      setCauses(prev => prev.filter(cause => cause.id !== id));
      if (selectedCause?.id === id) {
        setSelectedCause(null);
      }
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCause,
    setSelectedCause,
    filteredCauses,
    showForm,
    setShowForm,
    editingCause,
    setEditingCause,
    handleAddCause,
    handleUpdateCause,
    handleDeleteCause
  };
}