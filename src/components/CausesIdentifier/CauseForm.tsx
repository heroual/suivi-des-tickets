import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import type { Cause } from './types';
import type { CauseType } from '../../types';

interface CauseFormProps {
  cause?: Cause | null;
  onSubmit: (cause: Omit<Cause, 'id'>) => void;
  onClose: () => void;
}

export default function CauseForm({ cause, onSubmit, onClose }: CauseFormProps) {
  const [formData, setFormData] = useState<Omit<Cause, 'id'>>({
    type: 'Technique',
    description: '',
    symptoms: [''],
    solutions: [''],
    preventiveMeasures: ['']
  });

  useEffect(() => {
    if (cause) {
      setFormData(cause);
    }
  }, [cause]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleArrayInput = (
    field: 'symptoms' | 'solutions' | 'preventiveMeasures',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'symptoms' | 'solutions' | 'preventiveMeasures') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'symptoms' | 'solutions' | 'preventiveMeasures', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {cause ? 'Modifier la Cause' : 'Nouvelle Cause'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CauseType }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Technique">Technique</option>
                <option value="Client">Client</option>
                <option value="Casse">Casse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            {['symptoms', 'solutions', 'preventiveMeasures'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                  {field === 'preventiveMeasures' ? 'Mesures Préventives' : field}
                </label>
                {formData[field as keyof typeof formData].map((item, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInput(field as any, index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(field as any, index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(field as any)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </button>
              </div>
            ))}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {cause ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}