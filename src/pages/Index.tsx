
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { DictionaryProvider } from '@/contexts/DictionaryContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <DictionaryProvider>
        <AppLayout />
      </DictionaryProvider>
    </AppProvider>
  );
};

export default Index;
