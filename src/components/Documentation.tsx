import React, { useEffect, useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { marked } from 'marked';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/docs/README.md')
        .then(response => response.text())
        .then(text => {
          setContent(marked(text));
        })
        .catch(error => {
          console.error('Error loading documentation:', error);
          setContent('Error loading documentation. Please try again later.');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}