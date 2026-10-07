import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakSentence } from '../utils/audio';

interface AudioPlayerProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  size = 'md',
  className = '',
  showLabel = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      await speakSentence(text);
    } finally {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title="Listen to English pronunciation"
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 active:scale-95 ${
        isPlaying
          ? 'bg-indigo-600 text-white shadow-glow animate-pulse'
          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/60 dark:border-indigo-800/60'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <Volume2 size={iconSizes[size]} className="animate-bounce" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="font-semibold">{isPlaying ? 'Playing...' : 'Listen'}</span>
      )}
    </button>
  );
};
