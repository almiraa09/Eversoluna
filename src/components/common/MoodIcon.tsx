import React from 'react';
import { Sparkles, Smile, CloudRain, Flame } from 'lucide-react';
import { MoodId } from '../../types/journal';

interface MoodIconProps {
  mood: MoodId;
  className?: string;
}

export const MoodIcon: React.FC<MoodIconProps> = ({ mood, className = 'w-4 h-4' }) => {
  switch (mood) {
    case 'super_happy':
      return <Sparkles className={className} />;
    case 'happy':
      return <Smile className={className} />;
    case 'sad':
      return <CloudRain className={className} />;
    case 'annoyed':
      return <Flame className={className} />;
    default:
      return <Smile className={className} />;
  }
};
