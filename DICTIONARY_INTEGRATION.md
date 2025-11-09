# Dictionary Integration Guide

## Overview
Kid-tionary now uses a **3-tier waterfall approach** for word definitions:

1. **Local Database** (word_definitions table) - Fastest, offline-capable
2. **Free Dictionary API** - Medium speed, free
3. **OpenAI GPT-4** - Slowest, costs money, highest quality

## Architecture

### Database Table: `word_definitions`
```sql
word TEXT PRIMARY KEY
phonetic TEXT
part_of_speech TEXT
definition_simple TEXT (Grade 3 level)
definition_medium TEXT (Grade 5 level)
definition_advanced TEXT (Grade 8+ level)
example TEXT
synonyms TEXT[]
antonyms TEXT[]
etymology TEXT
source TEXT (wiktionary/wordnet/freedict/openai)
```

### Edge Function: `fetch-dictionary-definition`
- Checks local DB first
- Falls back to Free Dictionary API
- Falls back to OpenAI
- **Automatically caches** all results to database

## Bulk Import Process

### Step 1: Extract Data

#### Option A: Wiktionary (6M+ entries)
```bash
# Download Wiktextract JSON
wget https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.json

# Extract and format
python scripts/wiktionary_extractor.py
# Output: wiktionary_definitions.json
```

#### Option B: WordNet (155K entries)
```bash
# Install NLTK
pip install nltk
python -c "import nltk; nltk.download('wordnet')"

# Extract and format
python scripts/wordnet_extractor.py
# Output: wordnet_definitions.json
```

### Step 2: Import to Supabase

1. Go to `/admin` page in Kid-tionary
2. Enter your admin key (set in Supabase secrets as `ADMIN_KEY`)
3. Paste the JSON content from extraction
4. Click "Import Definitions"

**Note:** Import in batches of 1000-5000 words to avoid timeouts.

## Benefits

✅ **Offline-first**: Works without internet after initial import
✅ **Fast**: Local DB lookups are instant
✅ **Cost-effective**: Reduces OpenAI API calls by 90%+
✅ **Comprehensive**: Wiktionary has 6M+ entries
✅ **Automatic caching**: New words are saved for future use

## API Usage Reduction

Before integration: **100% OpenAI** (~$0.0005 per word)
After integration: **~5% OpenAI** (only for rare/new words)

**Estimated savings**: $0.50 per 1000 word lookups

## Maintenance

The system automatically caches:
- Free Dictionary API results
- OpenAI-generated definitions

Over time, your local database will grow organically with student usage.
