import React from 'react';
import { MessageSquare, ThumbsUp, Star, Calendar, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Feedback } from '../types';
import { useAuth } from '../hooks/useAuth';
import { deleteFeedback } from '../services/firebase';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (id: string) => void;
}

export default function FeedbackList({ feedbacks, onEdit, onDelete }: FeedbackListProps) {
  const { isAdmin } = useAuth();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) return;
    
    try {
      await deleteFeedback(id);
      onDelete?.(id);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Erreur lors de la suppression du feedback');
    }
  };

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun feedback pour le moment</h3>
        <p className="text-gray-500">Soyez le premier à partager votre avis !</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {feedback.type === 'suggestion' ? (
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-purple-600" />
                </div>
              ) : (
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{feedback.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feedback.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < feedback.rating ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit?.(feedback)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(feedback.createdAt, 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </div>
        </div>
      ))}
    </div>
  );
}