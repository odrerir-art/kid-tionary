import { extendedDictionary } from './extendedDictionary';

export interface Definition {

  levels: {
    simple: string;
    medium: string;
    advanced: string;
  };
  partOfSpeech: string;
  example?: string;
  visualType?: 'single' | 'comic';
  imageUrl?: string;
}

export interface WordEntry {
  word: string;
  definitions: Definition[];
  pronunciation?: string;
}

export const mockDictionary: Record<string, WordEntry> = {
  ...extendedDictionary,
  happy: {
    word: 'happy',
    pronunciation: 'HAP-ee',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'adjective',
        levels: {
          simple: 'You feel good. You smile.',
          medium: 'When you feel happy, you feel good inside and want to smile.',
          advanced: 'A feeling of joy and contentment that makes you smile and feel good.',
        },
        example: 'I am happy when I play with my friends.',
        visualType: 'single',
      },
    ],
  },
  run: {
    word: 'run',
    pronunciation: 'RUN',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'verb',
        levels: {
          simple: 'Move fast with your legs.',
          medium: 'To move quickly by moving your legs fast, faster than walking.',
          advanced: 'To move rapidly on foot, with both feet off the ground during each stride.',
        },
        example: 'The dog likes to run in the park.',
        visualType: 'comic',
      },
    ],
  },
  apple: {
    word: 'apple',
    pronunciation: 'AP-ul',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'noun',
        levels: {
          simple: 'A round fruit you can eat. It is red or green.',
          medium: 'A round fruit that grows on trees. Apples can be red, green, or yellow and taste sweet or sour.',
          advanced: 'A round fruit with red, green, or yellow skin that grows on apple trees and is commonly eaten fresh or used in cooking.',
        },
        example: 'I ate a red apple for snack.',
        visualType: 'single',
        imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68e24805acad960e72719ec8_1759660091074_d77cdf66.webp',
      },
    ],
  },
  dog: {
    word: 'dog',
    pronunciation: 'DAWG',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'noun',
        levels: {
          simple: 'An animal that barks. Dogs are pets.',
          medium: 'A furry animal with four legs that people keep as pets. Dogs bark and wag their tails.',
          advanced: 'A domesticated carnivorous mammal that is commonly kept as a pet or working animal, known for loyalty and companionship.',
        },
        example: 'My dog loves to play fetch.',
        visualType: 'single',
        imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68e24805acad960e72719ec8_1759660091838_5c5e3257.webp',
      },
    ],
  },
};


export const spellCheckSuggestions: Record<string, string> = {
  aple: 'apple',
  appl: 'apple',
  happi: 'happy',
  hapy: 'happy',
  runn: 'run',
  doog: 'dog',
  dawg: 'dog',
  frend: 'friend',
  freind: 'friend',
  bigg: 'big',
  reed: 'read',
  laff: 'laugh',
  laf: 'laugh',
  jum: 'jump',
  kynd: 'kind',
};

