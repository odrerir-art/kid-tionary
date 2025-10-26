import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      onSearch(searchTerm.toLowerCase().trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type any word to learn..."
            disabled={isLoading}
            className="w-full px-6 py-5 pr-14 text-xl text-gray-800 rounded-2xl border-4 border-blue-300 focus:border-blue-500 focus:outline-none shadow-lg transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </div>
      </form>
      
      <p className="mt-3 text-center text-white/90 text-sm">
        ✨ Try any word! Our AI will create a definition just for you.
      </p>
    </div>
  );
};

export default SearchBar;