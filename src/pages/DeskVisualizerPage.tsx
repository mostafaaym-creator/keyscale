import React from 'react';
import { DeskVisualizer } from '@/components/desk/DeskVisualizer';

export const DeskVisualizerPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DeskVisualizer />
    </div>
  );
};
