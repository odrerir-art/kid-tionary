#!/usr/bin/env python3
"""
Wiktionary Data Extractor for Kid-tionary
Extracts word definitions from Wiktionary dump and formats for bulk import
"""

import json
import re
from typing import Dict, List

def simplify_definition(definition: str, level: str = 'simple') -> str:
    """Simplify definitions for different reading levels"""
    # Remove technical notation
    definition = re.sub(r'\([^)]*\)', '', definition)
    definition = re.sub(r'\[[^\]]*\]', '', definition)
    
    if level == 'simple':
        # Keep first sentence only, limit to 100 chars
        first_sentence = definition.split('.')[0]
        return first_sentence[:100] + ('...' if len(first_sentence) > 100 else '')
    elif level == 'medium':
        # Keep first two sentences, limit to 200 chars
        sentences = definition.split('.')[:2]
        result = '. '.join(sentences)
        return result[:200] + ('...' if len(result) > 200 else '')
    else:
        # Keep full definition, limit to 400 chars
        return definition[:400] + ('...' if len(definition) > 400 else '')

def extract_from_wiktextract(json_file: str, output_file: str, limit: int = 1000):
    """
    Extract definitions from Wiktextract JSON output
    
    Usage:
    1. Download Wiktionary dump from: https://kaikki.org/dictionary/English/
    2. Extract the JSON file
    3. Run: python wiktionary_extractor.py
    """
    
    definitions = []
    
    with open(json_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= limit:
                break
                
            try:
                entry = json.loads(line)
                
                word = entry.get('word', '').lower()
                if not word or len(word) > 50:
                    continue
                
                # Get first sense
                senses = entry.get('senses', [])
                if not senses:
                    continue
                    
                sense = senses[0]
                glosses = sense.get('glosses', [])
                if not glosses:
                    continue
                
                definition = glosses[0]
                
                # Extract data
                definitions.append({
                    'word': word,
                    'phonetic': entry.get('sounds', [{}])[0].get('ipa', ''),
                    'part_of_speech': entry.get('pos', 'unknown'),
                    'definition_simple': simplify_definition(definition, 'simple'),
                    'definition_medium': simplify_definition(definition, 'medium'),
                    'definition_advanced': simplify_definition(definition, 'advanced'),
                    'example': sense.get('examples', [{}])[0].get('text', ''),
                    'synonyms': [s.get('word', '') for s in sense.get('synonyms', [])][:5],
                    'antonyms': [a.get('word', '') for a in sense.get('antonyms', [])][:5],
                    'etymology': entry.get('etymology_text', ''),
                    'source': 'wiktionary'
                })
                
            except Exception as e:
                print(f"Error processing line {i}: {e}")
                continue
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(definitions, f, indent=2)
    
    print(f"Extracted {len(definitions)} definitions to {output_file}")

if __name__ == '__main__':
    # Example usage
    extract_from_wiktextract(
        'kaikki.org-dictionary-English.json',
        'wiktionary_definitions.json',
        limit=10000  # Adjust as needed
    )
