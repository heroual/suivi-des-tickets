import React from 'react';
import { Brain } from 'lucide-react';

interface ActionPlanButtonProps {
  onClick: () => void;
}

export default function ActionPlanButton({ onClick }: ActionPlanButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:bottom-4 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center space-x-2"
    >
      <Brain className="w-5 h-5" />
      <span className="pr-2">Plan d'Actions</span>
    </button>
  );
}