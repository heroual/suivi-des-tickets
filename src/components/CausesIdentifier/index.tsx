import React from 'react';
import { Brain, PlusCircle } from 'lucide-react';
import SearchBar from './SearchBar';
import CausesList from './CausesList';
import CauseForm from './CauseForm';
import useCauses from './useCauses';
import { useAuth } from '../../hooks/useAuth';

export default function CausesIdentifier() {
  const { isAdmin } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    filteredCauses,
    selectedCause,
    setSelectedCause,
    showForm,
    setShowForm,
    editingCause,
    setEditingCause,
    handleAddCause,
    handleUpdateCause,
    handleDeleteCause
  } = useCauses();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Identificateur de Causes</h2>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => {
              setEditingCause(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nouvelle Cause
          </button>
        )}
      </div>

      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <CausesList 
        causes={filteredCauses}
        selectedCause={selectedCause}
        onSelectCause={setSelectedCause}
        onEdit={isAdmin ? setEditingCause : undefined}
        onDelete={isAdmin ? handleDeleteCause : undefined}
      />

      {showForm && (
        <CauseForm
          cause={editingCause}
          onSubmit={editingCause ? handleUpdateCause : handleAddCause}
          onClose={() => {
            setShowForm(false);
            setEditingCause(null);
          }}
        />
      )}
    </div>
  );
}