import React from 'react';
import { Brain } from 'lucide-react';
import SearchBar from './SearchBar';
import CausesList from './CausesList';
import useCauses from './useCauses';

export default function CausesIdentifier() {
  const {
    searchQuery,
    setSearchQuery,
    filteredCauses,
    selectedCause,
    setSelectedCause
  } = useCauses();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Identificateur de Causes</h2>
      </div>

      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <CausesList 
        causes={filteredCauses}
        selectedCause={selectedCause}
        onSelectCause={setSelectedCause}
      />
    </div>
  );
}