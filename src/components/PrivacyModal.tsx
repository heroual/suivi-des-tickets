import React from 'react';
import { Shield } from 'lucide-react';
import BaseModal from './BaseModal';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Politique de confidentialité"
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-lg mb-3">Collecte des données</h3>
          <p className="text-gray-600 mb-4">
            Nous collectons uniquement les données nécessaires au fonctionnement du service :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Informations d'identification professionnelle</li>
            <li>Données relatives aux interventions techniques</li>
            <li>Statistiques d'utilisation du service</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">Utilisation des données</h3>
          <p className="text-gray-600 mb-4">
            Les données collectées sont utilisées exclusivement pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>La gestion des interventions techniques</li>
            <li>L'amélioration de la qualité de service</li>
            <li>L'analyse des performances</li>
            <li>La génération de rapports statistiques</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">Protection des données</h3>
          <p className="text-gray-600 mb-4">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Chiffrement des données sensibles</li>
            <li>Authentification sécurisée</li>
            <li>Accès restreint aux données</li>
            <li>Surveillance continue de la sécurité</li>
          </ul>
        </section>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            Pour toute question concernant la protection de vos données, contactez notre responsable :
            <br />
            Email: elheroual@gmail.com
          </p>
        </div>
      </div>
    </BaseModal>
  );
}