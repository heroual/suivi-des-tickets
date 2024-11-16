import React, { useState } from 'react';
import { X, LogIn, Loader, Router, Shield, Users, Clock } from 'lucide-react';
import { loginUser } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - App Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white md:w-1/2">
            <div className="h-full flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <Router className="w-10 h-10" />
                <h1 className="text-3xl font-bold">STICKETS</h1>
              </div>
              
              <p className="text-xl font-semibold mb-6">
                Système de Gestion des Tickets SAV
              </p>
              
              <div className="space-y-6 flex-grow">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Sécurisé et Fiable</h3>
                    <p className="text-blue-100">Gestion sécurisée des interventions techniques avec traçabilité complète</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Collaboration Efficace</h3>
                    <p className="text-blue-100">Coordination optimale entre les équipes techniques</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Suivi en Temps Réel</h3>
                    <p className="text-blue-100">Monitoring continu des interventions et des performances</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 text-sm text-blue-100">
                © {new Date().getFullYear()} STICKETS - Direction Régionale d'Agadir
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="votre.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Accès réservé au personnel autorisé</p>
              <p className="mt-1">Direction Régionale d'Agadir - Secteur Taroudant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}