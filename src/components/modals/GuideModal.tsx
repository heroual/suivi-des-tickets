import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import BaseModal from './BaseModal';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Guide d'utilisation"
      icon={<BookOpen className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Démarrage rapide
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Connectez-vous avec vos identifiants</li>
            <li>Accédez au tableau de bord principal</li>
            <li>Consultez les statistiques en temps réel</li>
            <li>Gérez les tickets d'intervention</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            Fonctionnalités principales
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Création et suivi des tickets</li>
            <li>Analyse des performances (PKI)</li>
            <li>Gestion des équipements</li>
            <li>Rapports et statistiques</li>
            <li>Import/Export des données</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            Points importants
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Vérifiez régulièrement les tickets en attente</li>
            <li>Respectez les délais d'intervention</li>
            <li>Documentez précisément les interventions</li>
            <li>Suivez les indicateurs de performance</li>
          </ul>
        </section>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Pour toute assistance supplémentaire, contactez le support technique :
            <br />
            Email: elheroual@gmail.com
            <br />
            Tél: +212 697 342 443
          </p>
        </div>
      </div>
    </BaseModal>
  );
}