import React from 'react';
import { HelpCircle, Lightbulb, Target, Smile } from 'lucide-react';

const HelpSection: React.FC = () => {
  const tips = [
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: 'Choose Your Grade',
      description: 'Pick your grade level to get definitions that match what you know.',
      color: 'from-blue-50 to-blue-100 border-blue-200',
    },
    {
      icon: <Lightbulb className="text-yellow-600" size={24} />,
      title: 'Make It Simpler',
      description: 'Click "Simpler" if the words are too hard. Click "More Detail" to learn more!',
      color: 'from-yellow-50 to-yellow-100 border-yellow-200',
    },
    {
      icon: <Smile className="text-green-600" size={24} />,
      title: 'See Pictures',
      description: 'Click "Show Picture" to see what the word looks like. Pictures help you remember!',
      color: 'from-green-50 to-green-100 border-green-200',
    },
    {
      icon: <HelpCircle className="text-purple-600" size={24} />,
      title: 'Spelling Help',
      description: "Don't worry about spelling! We'll help you find the right word.",
      color: 'from-purple-50 to-purple-100 border-purple-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        How to Use This Dictionary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${tip.color} rounded-xl p-4 border-2`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{tip.icon}</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-700">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSection;
