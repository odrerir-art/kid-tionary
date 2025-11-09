# Definition Quality Improvements

## Overview
Enhanced the `generate-definition` edge function to provide clearer, simpler definitions for elementary students.

## Key Improvements

### 1. Prioritize Simple Synonyms
- Definitions now START with a simple synonym when available
- Prefer words with:
  - Fewer syllables
  - No digraphs (ch, sh, th, ph)
  - No consonant blends (str, spr, scr, thr)
  - Simple, common spelling

**Examples:**
- "enormous" → "Very big"
- "sprint" → "Run fast"
- "delicious" → "Tastes good"
- "gigantic" → "Very big"
- "tiny" → "Very small"

### 2. Dick and Jane Level Sentences
All explanation sentences use extremely simple structure:
- 3-6 words maximum
- Subject-verb-object pattern
- Common, everyday vocabulary
- Present tense when possible

**Examples:**
- "See Jane run."
- "The dog is big."
- "Mom can cook."
- "The cat is soft."
- "Tom likes to play."

### 3. Definition Structure

**SIMPLE (3-5 words):**
- Start with 1-2 word synonym
- Add 2-3 clarifying words if needed
- Example: "Very big" or "Run fast"

**MEDIUM (8-12 words):**
- Synonym + simple Dick and Jane sentence
- Example: "Very big. The elephant is enormous."

**ADVANCED (15-20 words):**
- Slightly longer but still simple vocabulary
- Example: "Something that is much bigger than most other things."

## Changes Made to Edge Function

### Updated Prompt Instructions
```
CRITICAL RULES FOR DEFINITIONS:
1. ALWAYS start with a simple synonym if one exists
2. Use "Dick and Jane" level sentences - extremely short and simple
3. Use only the most common, everyday words that young children know
```

### Added Examples in Prompt
Provided concrete examples to guide AI:
- "enormous" → simple: "Very big", medium: "Very big. The elephant is enormous."
- "sprint" → simple: "Run fast", medium: "Run very fast. See Tom sprint."
- "delicious" → simple: "Tastes good", medium: "Tastes very good. The cake is delicious."

### Reduced Temperature
Changed from 0.7 to 0.3 for more consistent, predictable outputs

### Enhanced System Message
Updated to emphasize: "Use the simplest possible words and very short sentences."

## Testing Recommendations

Test with these word types:

**Simple Nouns:**
- cat, dog, house, tree, car
- Should get: "An animal" or "A place"

**Action Verbs:**
- run, jump, eat, sleep, play
- Should get: Simple action words

**Adjectives:**
- big, small, happy, sad, fast
- Should get: One-word synonyms when possible

**Complex Words:**
- enormous, magnificent, spectacular
- Should get: Simple synonym first, then explanation

## Expected Results

**Before:**
- "enormous" → "Extremely large in size or extent"
- Example: "The enormous elephant towered over the other animals."

**After:**
- "enormous" → "Very big"
- Example: "The elephant is big."

## Manual Update Instructions

If the automatic update failed, manually update the `generate-definition` function in Supabase:

1. Go to Supabase Dashboard → Edge Functions
2. Find `generate-definition` function
3. Update the prompt section (around line 90) with the new CRITICAL RULES
4. Add the EXAMPLES section to the prompt
5. Change temperature from 0.7 to 0.3
6. Update system message to include "Use the simplest possible words and very short sentences"
7. Deploy the updated function
