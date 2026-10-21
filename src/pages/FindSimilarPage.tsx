import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FindSimilar } from '@/components/discovery/FindSimilar';

export const FindSimilarPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || undefined;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FindSimilar initialKeyboardId={id} />
    </div>
  );
};
