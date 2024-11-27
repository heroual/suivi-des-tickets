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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun feedback pour le moment</h3>
        <p className="text-gray-600">Soyez le premier à partager votre avis !</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {feedback.type === 'suggestion' ? (
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ThumbsUp className="w-5 h-5 text-purple-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{feedback.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{feedback.description}</p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit?.(feedback)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1.5" />
                {format(feedback.createdAt, 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < feedback.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}