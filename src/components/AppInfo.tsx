import React from 'react';
import { X, Award, BarChart2, Clock, Users } from 'lucide-react';

interface AppInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppInfo({ isOpen, onClose }: AppInfoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">À Propos de l'Application</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-start space-x-4">
              <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Développé par</h3>
                <p className="text-gray-600">Mr ELHEROUAL Salah Eddine</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600">
              <div className="flex items-start space-x-4">
                <BarChart2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Objectif</h3>
                  <p>Optimiser le suivi des tickets SAV pour améliorer la qualité de service et la satisfaction client.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Fonctionnalités Principales</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Suivi en temps réel des tickets</li>
                    <li>Analyse statistique détaillée</li>
                    <li>Gestion des délais de résolution</li>
                    <li>Suivi des réouvertures de tickets</li>
                    <li>Tableau de bord interactif</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Bénéfices</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Amélioration du temps de résolution</li>
                    <li>Meilleure traçabilité des interventions</li>
                    <li>Optimisation de la charge de travail</li>
                    <li>Identification des problèmes récurrents</li>
                    <li>Amélioration continue du service</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} SAV TAROUDANT - Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}