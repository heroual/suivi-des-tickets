import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import GuideModal from './modals/GuideModal';
import TermsModal from './modals/TermsModal';
import PrivacyModal from './modals/PrivacyModal';

export default function Footer() {
  const [showGuide, setShowGuide] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleNavigation = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <a href="https://github.com/heroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/elheroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/elheroual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavigation('dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('tickets')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tickets
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('analytics')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Analytics
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('documentation')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </button>
              </li>
            </ul>
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

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Guide d'utilisation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Conditions d'utilisation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Politique de confidentialité
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-100">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} STickets SAV Taroudant. Tous droits réservés.
            </p>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Développé avec ❤️ par Ing. Salah Eddine ELHEROUAL
              </p>
            </div>
          </div>
        </div>
      </div>

      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </footer>
  );
}