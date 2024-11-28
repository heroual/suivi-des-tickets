import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import FeedbackList from './FeedbackList';
import { getFeedbacks } from '../services/firebase';
import type { Feedback } from '../types';

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const loadedFeedbacks = await getFeedbacks();
      setFeedbacks(loadedFeedbacks);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await loadFeedbacks();
    } catch (error) {
      console.error('Error reloading feedbacks:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Feedback & Suggestions</h2>
              <p className="text-sm text-gray-600">Avis et suggestions des utilisateurs</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <FeedbackList
            feedbacks={feedbacks}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}