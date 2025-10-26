import { WordEntry } from './dictionaryData';

export const extendedDictionary: Record<string, WordEntry> = {
  jump: {
    word: 'jump',
    pronunciation: 'JUMP',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'verb',
        levels: {
          simple: 'Push your feet off the ground and go up in the air.',
          medium: 'To push yourself up into the air using your legs and feet.',
          advanced: 'To propel oneself off the ground by pushing forcefully with the legs and feet.',
        },
        example: 'I can jump over the puddle.',
        visualType: 'comic',
      },
    ],
  },
  friend: {
    word: 'friend',
    pronunciation: 'FREND',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'noun',
        levels: {
          simple: 'Someone you like and who likes you. You play together.',
          medium: 'A person you like to spend time with and who cares about you.',
          advanced: 'A person with whom one has a bond of mutual affection and trust.',
        },
        example: 'My best friend and I play at recess.',
        visualType: 'single',
      },
    ],
  },
  big: {
    word: 'big',
    pronunciation: 'BIG',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'adjective',
        levels: {
          simple: 'Very large. Not small.',
          medium: 'Something that is large in size, bigger than other things.',
          advanced: 'Of considerable size, extent, or intensity; large in dimensions.',
        },
        example: 'The elephant is a big animal.',
        visualType: 'single',
      },
    ],
  },
  read: {
    word: 'read',
    pronunciation: 'REED',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'verb',
        levels: {
          simple: 'Look at words and know what they say.',
          medium: 'To look at written words and understand what they mean.',
          advanced: 'To interpret written or printed words and comprehend their meaning.',
        },
        example: 'I like to read books about dinosaurs.',
        visualType: 'comic',
        imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68e24805acad960e72719ec8_1759660092531_34fd1f58.webp',
      },
    ],
  },
  laugh: {
    word: 'laugh',
    pronunciation: 'LAF',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'verb',
        levels: {
          simple: 'Make sounds when something is funny. Ha ha ha!',
          medium: 'To make sounds with your voice when something is funny or makes you happy.',
          advanced: 'To express amusement or joy through vocal sounds and facial expressions.',
        },
        example: 'The joke made everyone laugh.',
        visualType: 'comic',
      },
    ],
  },
  kind: {
    word: 'kind',
    pronunciation: 'KYND',
    definitions: [
      {
        id: 1,
        partOfSpeech: 'adjective',
        levels: {
          simple: 'Nice to others. You help people and are friendly.',
          medium: 'Being friendly, helpful, and caring toward other people.',
          advanced: 'Having a gentle, caring, and considerate nature toward others.',
        },
        example: 'She was kind and shared her crayons with me.',
        visualType: 'single',
      },
    ],
  },
};
