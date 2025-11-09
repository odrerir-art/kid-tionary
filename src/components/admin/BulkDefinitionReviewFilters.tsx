// Quality check functions for definitions
export const hasComplexWords = (text: string): boolean => {
  const complexWords = [
    'utilize', 'facilitate', 'implement', 'subsequently', 'furthermore',
    'nevertheless', 'consequently', 'therefore', 'however', 'although',
    'particularly', 'specifically', 'essentially', 'basically', 'literally'
  ];
  const lowerText = text.toLowerCase();
  return complexWords.some(word => lowerText.includes(word));
};

export const isTooLong = (text: string, maxLength: number = 100): boolean => {
  return text.length > maxLength;
};

export const hasDigraphsOrBlends = (word: string): boolean => {
  const patterns = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 
                    'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 
                    'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 
                    'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'];
  const lowerWord = word.toLowerCase();
  return patterns.some(pattern => lowerWord.includes(pattern));
};

export const startsWithSynonym = (definition: string): boolean => {
  // Check if definition starts with a simple word (likely a synonym)
  // followed by punctuation or "means" or "is"
  const synonymPattern = /^[a-z]{2,8}[\s,;]|^[a-z]{2,8}\s+(means|is)/i;
  return synonymPattern.test(definition.trim());
};

export const countSyllables = (word: string): number => {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};