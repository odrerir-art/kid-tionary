import React from 'react';

interface GradeLevelSelectorProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

const grades = ['K', '1', '2', '3', '4', '5', '6'];

const GradeLevelSelector: React.FC<GradeLevelSelectorProps> = ({ selectedGrade, onGradeChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold text-gray-700">Grade Level:</span>
      {grades.map((grade) => (
        <button
          key={grade}
          onClick={() => onGradeChange(grade)}
          className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
            selectedGrade === grade
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-blue-400 hover:scale-105'
          }`}
        >
          {grade}
        </button>
      ))}
    </div>
  );
};

export default GradeLevelSelector;
