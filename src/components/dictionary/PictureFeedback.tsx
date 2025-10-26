import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PictureFeedbackProps {
  word: string;
  panelNumber?: number;
}

const PictureFeedback: React.FC<PictureFeedbackProps> = ({ word, panelNumber = 1 }) => {
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = async (type: 'helpful' | 'confused') => {
    try {
      const { error } = await supabase
        .from('picture_feedback')
        .insert({ 
          word: word.toLowerCase(), 
          feedback_type: type,
          panel_number: panelNumber 
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Thanks for your feedback!",
        description: type === 'helpful' ? "Glad the picture helped!" : "We'll work on improving this picture."
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center gap-4 mt-4 text-green-600 font-medium">
        ✓ Thank you!
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => submitFeedback('helpful')}
        className="flex items-center gap-2 hover:bg-green-50"
      >
        <span className="text-2xl">😊👍</span>
        <span>Helpful</span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => submitFeedback('confused')}
        className="flex items-center gap-2 hover:bg-yellow-50"
      >
        <span className="text-2xl">😕❓</span>
        <span>Confusing</span>
      </Button>
    </div>
  );
};

export default PictureFeedback;
