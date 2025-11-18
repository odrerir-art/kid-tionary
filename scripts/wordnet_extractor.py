#!/usr/bin/env python3
"""
WordNet Data Extractor for Kid-tionary
Extracts word definitions from NLTK WordNet and formats for bulk import
"""

import json
from typing import List, Dict

try:
    import nltk
    from nltk.corpus import wordnet as wn
except ImportError:
    print("Please install NLTK: pip install nltk")
    print("Then run: python -c 'import nltk; nltk.download(\"wordnet\")'")
    exit(1)

def simplify_definition(definition: str, level: str = 'simple') -> str:
    """Simplify definitions for different reading levels"""
    if level == 'simple':
        return definition[:100] + ('...' if len(definition) > 100 else '')
    elif level == 'medium':
        return definition[:200] + ('...' if len(definition) > 200 else '')
    else:
        return definition

def extract_from_wordnet(output_file: str, limit: int = 10000):
    """
    Extract definitions from WordNet
    
    Installation:
    pip install nltk
    python -c "import nltk; nltk.download('wordnet')"
    
    Usage:
    python wordnet_extractor.py
    """
    
    definitions = []
    processed_words = set()
    
    # Get all synsets
    all_synsets = list(wn.all_synsets())
    
    for synset in all_synsets[:limit]:
        try:
            # Get lemmas (word forms)
            for lemma in synset.lemmas():
                word = lemma.name().lower().replace('_', ' ')
                
                # Skip if already processed or too long
                if word in processed_words or len(word) > 50:
                    continue
                
                processed_words.add(word)
                
                # Get definition
                definition = synset.definition()
                
                # Get examples
                examples = synset.examples()
                example = examples[0] if examples else ''
                
                # Get synonyms from same synset
                synonyms = [l.name().replace('_', ' ') for l in synset.lemmas() if l.name() != lemma.name()][:5]
                
                # Get antonyms
                antonyms = []
                for l in lemma.antonyms():
                    antonyms.append(l.name().replace('_', ' '))
                antonyms = antonyms[:5]
                
                # Get POS
                pos_map = {'n': 'noun', 'v': 'verb', 'a': 'adjective', 'r': 'adverb', 's': 'adjective'}
                pos = pos_map.get(synset.pos(), 'unknown')
                
                definitions.append({
                    'word': word,
                    'phonetic': '',  # WordNet doesn't have phonetics
                    'part_of_speech': pos,
                    'definition_simple': simplify_definition(definition, 'simple'),
                    'definition_medium': simplify_definition(definition, 'medium'),
                    'definition_advanced': definition,
                    'example': example,
                    'synonyms': synonyms,
                    'antonyms': antonyms,
                    'source': 'wordnet'
                })
                
        except Exception as e:
            print(f"Error processing synset {synset}: {e}")
            continue
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(definitions, f, indent=2)
    
    print(f"Extracted {len(definitions)} definitions to {output_file}")

if __name__ == '__main__':
    # Extract all WordNet entries (~117K synsets)
    # The upsert in bulk-import-definitions will handle duplicates automatically
    extract_from_wordnet('wordnet_definitions.json', limit=117000)
