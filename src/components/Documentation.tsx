import React, { useEffect, useState } from 'react';
import { X, BookOpen, Loader } from 'lucide-react';
import { marked } from 'marked';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      
      // Configure marked options for better security and rendering
      marked.setOptions({
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // Convert \n to <br>
        headerIds: true, // Add IDs to headers
        mangle: false, // Don't escape HTML
        sanitize: false // Don't sanitize HTML
      });

      fetch('/docs/README.md')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load documentation');
          }
          return response.text();
        })
        .then(text => {
          setContent(marked(text));
          setError(null);
        })
        .catch(error => {
          console.error('Error loading documentation:', error);
          setError('Une erreur est survenue lors du chargement de la documentation. Veuillez réessayer.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Erreur de chargement</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div 
              className="prose prose-blue prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
// ... previous imports remain the same
import { useAuth } from '../hooks/useAuth';
import AccessDeniedMessage from './AccessDeniedMessage';

export default function DeviceManagement() {
  const { isAdmin } = useAuth();
  
  // ... rest of the component code remains the same until the return statement

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Router className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Équipements
                </h1>
                <p className="text-sm text-gray-600">
                  Routeurs et points d'accès installés
                </p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Nouvel équipement
                </button>
                <button
                  onClick={exportToExcel}
                  className="btn-secondary"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exporter Excel
                </button>
              </div>
            )}
          </div>

          {!isAdmin && <AccessDeniedMessage />}

          {/* Rest of the component remains the same, but wrap edit/delete buttons with isAdmin check */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={searchDurée}
                onChange={(e) => setSearchDurée(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... table header ... */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  {/* ... device data cells ... */}
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(device)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(device.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && isAdmin && <DeviceForm />}
    </div>
  );
}