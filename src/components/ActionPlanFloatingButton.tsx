import React from 'react';
import { Brain } from 'lucide-react';

interface ActionPlanFloatingButtonProps {
  onClick: () => void;
}

export default function ActionPlanFloatingButton({ onClick }: ActionPlanFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:bottom-4 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
    >
      <div className="relative flex items-center px-6 py-3">
        <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
        <span className="font-medium">Plan d'Actions</span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
      </div>
    </button>
  );
}