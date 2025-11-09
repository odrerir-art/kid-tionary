# Backend Fixes Needed for Definition Consistency & Quality

## Issue 1: Inconsistent Definitions
The same word shows different definitions because `generate-definition` generates fresh definitions each time instead of checking the database first.

## Issue 2: Poor Definition Quality
Definitions are too complex for elementary students. Need simple synonyms and "Dick and Jane" level sentences.

## Required Fixes for Edge Function: `generate-definition`

### Fix 1: Add Database Caching (for consistency)

**Add at beginning (after line 16, after getting word and gradeLevel):**

```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CHECK DATABASE FIRST for consistency
const { data: dbEntry } = await supabase
  .from('word_definitions')
  .select('*')
  .eq('word', word.toLowerCase())
  .single();

if (dbEntry) {
  // Return cached definition
  return new Response(JSON.stringify({
    word: dbEntry.word,
    type: dbEntry.part_of_speech,
    pronunciation: dbEntry.phonetic || word.toLowerCase(),
    definitions: {
      simple: dbEntry.definition_simple,
      medium: dbEntry.definition_medium,
      advanced: dbEntry.definition_advanced
    },
    example: dbEntry.example || `I use ${word} every day.`,
    category: "regular",
    isSound: false,
    isMadeUp: false,
    isNonEnglish: false,
    noVisual: false
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
```

**Add at end (before returning definition):**

```typescript
// CACHE TO DATABASE for future consistency
await supabase.from('word_definitions').insert({
  word: word.toLowerCase(),
  phonetic: definition.pronunciation,
  part_of_speech: definition.type,
  definition_simple: definition.definitions.simple,
  definition_medium: definition.definitions.medium,
  definition_advanced: definition.definitions.advanced,
  example: definition.example,
  source: 'openai-kid'
}).onConflict('word').ignore();
```

### Fix 2: Improve Definition Quality

**Update the prompt section (around line 90) to:**

```typescript
let prompt = `You are a children's dictionary for ${gradeDescription} students.

CRITICAL RULES:
1. START with a simple synonym when possible (fewer syllables, no digraphs like ch/sh/th, no consonant blends like str/spr, simple spelling)
2. Use "Dick and Jane" level sentences: 3-6 words, very simple structure like "See Jane run." or "The dog is big."
3. Use only common everyday words that young children know

For "${word}":
1. Word type (noun, verb, adjective, etc.)
2. Three definitions:
   - SIMPLE: 1-2 word synonym + 2-3 words if needed (e.g., "Very big")
   - MEDIUM: Synonym + Dick-Jane sentence (e.g., "Very big. The elephant is big.")
   - ADVANCED: Longer but still simple (10-15 words)
3. Dick-Jane example sentence (3-6 words like "The cat is soft.")
4. Pronunciation (phonetic)
5. Is it a sound/made-up/non-English word?`;

if (isMultiPanel) {
  prompt += `\n6. ${panelCount} panel descriptions (10-15 words each)`;
}

prompt += `\n\nEXAMPLES OF GOOD DEFINITIONS:
- "enormous" → simple: "Very big", medium: "Very big. The elephant is enormous.", example: "The house is big."
- "sprint" → simple: "Run fast", medium: "Run very fast. See Tom sprint.", example: "I can run fast."
- "delicious" → simple: "Tastes good", medium: "Tastes very good. The cake is delicious.", example: "The food tastes good."

Respond with valid JSON only in this format:
{
  "word": "${word}",
  "type": "noun",
  "pronunciation": "pronunciation",
  "definitions": {
    "simple": "synonym or very short definition",
    "medium": "synonym plus simple sentence",
    "advanced": "longer but still simple definition"
  },
  "example": "Very short simple sentence.",
  "category": "regular",
  "isSound": false,
  "isMadeUp": false,
  "isNonEnglish": false${isMultiPanel ? ',\n  "panelDescriptions": ["Panel 1", "Panel 2"]' : ''}
}`;
```

### Fix 3: Adjust AI Parameters

**Change temperature from 0.7 to 0.3:**
```typescript
temperature: 0.3,  // Lower = more consistent
```

**Update system message:**
```typescript
{ role: 'system', content: 'You are a children\'s dictionary. Always use the simplest words and shortest sentences. Respond with valid JSON only.' }
```

## How to Apply These Fixes

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Find **generate-definition** function
3. Click **Edit**
4. Apply all three fixes above:
   - Add database check at beginning
   - Add caching at end
   - Update prompt with new rules and examples
   - Change temperature to 0.3
   - Update system message
5. Click **Deploy**

## Expected Results

✅ **Consistency:** Same word always returns same definition
✅ **Quality:** Definitions start with simple synonyms
✅ **Simplicity:** "Dick and Jane" level sentences
✅ **Speed:** Faster (database cache vs AI generation)

## Testing

After applying fixes, test with:
- "enormous" → should get "Very big"
- "sprint" → should get "Run fast"
- "delicious" → should get "Tastes good"

Search same word multiple times → should get identical results
