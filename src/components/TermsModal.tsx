import React from 'react';
import { Scale } from 'lucide-react';
import BaseModal from './BaseModal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conditions d'utilisation"
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-lg mb-3">1. Utilisation du service</h3>
          <p className="text-gray-600 mb-4">
            STickets est un outil interne destiné exclusivement aux employés de la Direction Régionale d'Agadir - Secteur Taroudant.
            L'utilisation du service est soumise à une authentification stricte.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">2. Confidentialité des données</h3>
          <p className="text-gray-600 mb-4">
            Les utilisateurs s'engagent à maintenir la confidentialité des informations
            accessibles via la plateforme et à ne pas les divulguer à des tiers non autorisés.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">3. Responsabilités</h3>
          <p className="text-gray-600 mb-4">
            Les utilisateurs sont responsables de l'exactitude des informations saisies
            et s'engagent à respecter les procédures établies pour la gestion des tickets.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">4. Propriété intellectuelle</h3>
          <p className="text-gray-600 mb-4">
            Tous les droits de propriété intellectuelle relatifs à STickets sont réservés.
            Toute reproduction ou utilisation non autorisée est strictement interdite.
          </p>
        </section>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            Ces conditions sont susceptibles d'être modifiées. Les utilisateurs seront
            informés de tout changement significatif.
          </p>
        </div>
      </div>
    </BaseModal>
  );
}