import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-dark-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              STickets SAV Taroudant
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plateforme intelligente de gestion des interventions techniques pour la Direction Régionale d'Agadir - Secteur Taroudant.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/heroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/elheroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/elheroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <a href="mailto:elheroual@gmail.com" className="hover:text-blue-600">
                  elheroual@gmail.com
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <a href="tel:+212697342443" className="hover:text-blue-600">
                  +212 697 342 443
                </a>
              </li>
              <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                <span>Direction Régionale d'Agadir<br />Secteur Taroudant<br />Maroc</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#tickets" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Tickets
                </a>
              </li>
              <li>
                <a href="#analytics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#documentation" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#guide" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Guide d'utilisation
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-100">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {currentYear} STickets SAV Taroudant. Tous droits réservés.</p>
            <p className="mt-2">
              Développé avec ❤️ par Ing. Salah Eddine ELHEROUAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}