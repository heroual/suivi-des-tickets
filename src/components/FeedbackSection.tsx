import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { addFeedback } from '../services/firebase';
import type { Feedback } from '../types';

export default function FeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    title: '',
    description: '',
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addFeedback({
        ...formData,
        createdAt: new Date()
      });
      setShowForm(false);
      setFormData({
        type: 'suggestion',
        title: '',
        description: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
          Votre Feedback
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Donner mon avis
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'suggestion' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'suggestion'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                <span className="block text-sm font-medium">Suggestion</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'improvement' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'improvement'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <Star className="w-6 h-6 mx-auto mb-2" />
                <span className="block text-sm font-medium">Amélioration</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating }))}
                  className={`p-2 rounded-full transition-colors ${
                    formData.rating >= rating
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Envoyer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}