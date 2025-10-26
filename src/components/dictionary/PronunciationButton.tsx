import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PronunciationButtonProps {
  word: string;
  className?: string;
  size?: number;
  variant?: 'default' | 'compact';
}

const PronunciationButton: React.FC<PronunciationButtonProps> = ({ 
  word, 
  className = '',
  size = 28,
  variant = 'default'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePronounce = () => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const baseClasses = variant === 'compact' 
    ? 'p-2 rounded-lg' 
    : 'p-4 rounded-full';

  return (
    <button 
      onClick={handlePronounce}
      disabled={isPlaying}
      className={`${baseClasses} ${className} ${
        isPlaying 
          ? 'bg-green-500 text-white animate-pulse scale-110' 
          : 'bg-white text-blue-600 hover:scale-110'
      } transition-all duration-200 shadow-lg disabled:cursor-not-allowed`}
      title={isPlaying ? 'Playing pronunciation...' : 'Hear pronunciation'}
    >
      {isPlaying ? (
        <Volume2 size={size} className="animate-bounce" />
      ) : (
        <Volume2 size={size} />
      )}
    </button>
  );
};

export default PronunciationButton;
