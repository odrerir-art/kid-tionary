# Multiple Definitions Update

## Problem
Words with multiple meanings or parts of speech (like "guide", "brew", "toy") only show ONE definition instead of all their uses.

## Backend Changes Needed

### 1. Update `fetch-dictionary-definition` Edge Function

The function currently returns only the FIRST part of speech from the API. It needs to return ALL parts of speech.

**Current behavior:**
```javascript
const meaning = entry.meanings[0]; // Only gets first meaning
```

**Required change:**
```javascript
// Get ALL meanings/parts of speech
const allMeanings = entry.meanings.map(meaning => ({
  partOfSpeech: meaning.partOfSpeech,
  definition: meaning.definitions[0].definition,
  example: meaning.definitions[0].example || ''
}));
```

### 2. Update Database Schema

Add a new table to store multiple definitions per word:

```sql
CREATE TABLE word_definition_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id UUID REFERENCES word_definitions(id),
  part_of_speech TEXT NOT NULL,
  definition_simple TEXT NOT NULL,
  definition_medium TEXT NOT NULL,
  definition_advanced TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Update Response Format

Return array of definitions instead of single definition:

```json
{
  "word": "guide",
  "phonetic": "/ɡaɪd/",
  "definitions": [
    {
      "partOfSpeech": "noun",
      "definitions": {
        "simple": "A person who shows the way",
        "medium": "Someone who leads or directs others",
        "advanced": "A person who advises or shows the way to others"
      },
      "example": "The tour guide showed us the museum."
    },
    {
      "partOfSpeech": "verb",
      "definitions": {
        "simple": "To show the way",
        "medium": "To lead or direct someone somewhere",
        "advanced": "To direct or influence the course of action"
      },
      "example": "She will guide us through the forest."
    }
  ]
}
```

## Frontend Updates

The frontend has been updated to handle multiple definitions when available.
