# Gradiated Reading Levels Implementation

## Overview
Instead of hard cutoffs between "simple", "medium", and "advanced" definitions, the system now uses gradiated reading levels (K through 8+) that smoothly increase in complexity.

## Grade Level Prompts

### Kindergarten (Ages 4-5)
- **Word count**: 1-3 words
- **Vocabulary**: Only words a 5-year-old knows
- **Examples**: cat=an animal, toy=thing to play with, big=very large

### 1st Grade (Ages 5-6)
- **Word count**: 3-5 words
- **Examples**: jump=to go up in the air, happy=feeling good, red=a color

### 2nd Grade (Ages 6-7)
- **Word count**: 4-6 words
- **Examples**: bicycle=thing with two wheels you ride, friend=someone you like, fast=moving quickly

### 3rd Grade (Ages 7-8)
- **Word count**: 5-8 words
- **Examples**: adventure=an exciting journey, curious=wanting to know about things

### 4th Grade (Ages 8-9)
- **Word count**: 6-10 words
- **Can use slightly harder words**
- **Examples**: sufficient=enough of something, ancient=very very old

### 5th Grade (Ages 9-10)
- **Word count**: 8-12 words
- **Examples**: analyze=to look at something carefully to understand it

### 6th Grade (Ages 10-11)
- **Word count**: 10-15 words
- **Can include context**
- **Examples**: democracy=a system where people vote to choose their leaders

### 7th Grade (Ages 11-12)
- **Word count**: 12-18 words
- **More detailed explanations**

### 8th Grade+ (Ages 12+)
- **Complete, clear definition with nuance**
- **Full context and examples**

## Implementation

The updated `fetch-dictionary-definition` function now:

1. **Uses gradiated prompts** based on actual grade level instead of 3 fixed levels
2. **Prioritizes MOST COMMON meanings** (toy=thing to play with, NOT toy=dog breed)
3. **Gradually increases complexity** as grade level increases
4. **Maintains smooth progression** without jarring jumps in difficulty

## Deployment

Update the `fetch-dictionary-definition` edge function with the code in `GRADIATED_DEFINITION_CODE.txt`
