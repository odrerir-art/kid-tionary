# Image Management Guide

## Overview
The Bulk Image Uploader allows you to manage word images for Kid-tionary. You can upload your own teaching materials, generate images with AI, or use free image sources.

## Features

### 1. Bulk Upload
- Upload multiple images at once
- File names should match the word (e.g., "cat.png", "dog.jpg")
- Supports: JPG, PNG, GIF, WebP
- Images are stored in Supabase Storage bucket `word-images`

### 2. AI Image Generation
- Generate simple, kid-friendly images using AI
- Enter one word per line
- Uses the existing `generate-definition` edge function
- Perfect for words without existing images

### 3. Free Image Sources

#### OpenClipart (openclipart.org)
- **License**: Public Domain (CC0)
- **Best for**: Simple clipart, educational illustrations
- **Quality**: Vector graphics (SVG)
- **Kid-friendly**: Yes, specifically good for teaching

#### Pixabay
- **License**: Free for commercial use
- **Best for**: Photos and illustrations
- **Quality**: High resolution
- **Kid-friendly**: Yes, but requires filtering

#### Unsplash
- **License**: Free for commercial use
- **Best for**: Professional photography
- **Quality**: Very high resolution
- **Kid-friendly**: Requires careful selection

#### Pexels
- **License**: Free for commercial use
- **Best for**: Stock photos
- **Quality**: High resolution
- **Kid-friendly**: Requires filtering

#### Wikimedia Commons
- **License**: Various (check each image)
- **Best for**: Educational content, historical images
- **Quality**: Varies
- **Kid-friendly**: Yes, extensive educational content

## Database Setup Required

Run this SQL to create the storage bucket:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('word-images', 'word-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public read access for word images"
ON storage.objects FOR SELECT
USING (bucket_id = 'word-images');

CREATE POLICY "Admin upload access for word images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'word-images');
```

## Best Practices

1. **Simple Images**: Use clear, simple illustrations for young learners
2. **Consistent Style**: Try to maintain visual consistency across images
3. **File Naming**: Always name files exactly as the word (lowercase)
4. **Size**: Optimize images to 500-800px width for web performance
5. **Format**: PNG for illustrations with transparency, JPG for photos
6. **Copyright**: Only use images you have rights to or that are public domain

## Workflow Recommendation

1. Start with your existing teaching materials (bulk upload)
2. Use OpenClipart for common objects and concepts
3. Generate AI images for abstract or uncommon words
4. Review and replace any low-quality images

## Technical Details

- Images stored in: `storage.buckets.word-images`
- Database table: `word_images` (word, image_url)
- Access: Public read, admin write
- CDN: Automatic via Supabase Storage
