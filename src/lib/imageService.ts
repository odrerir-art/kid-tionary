// Free educational image service using Pixabay API
// Pixabay provides free images for educational use without attribution requirement

const PIXABAY_API_KEY = '47579089-4b0b8e6c8e5c3b8f5e5b8e6c8'; // Free tier API key

export interface ImageResult {
  url: string;
  thumbnail: string;
  source: 'pixabay' | 'upload' | 'cache';
  attribution?: string;
}

export async function searchEducationalImage(word: string): Promise<ImageResult | null> {
  try {
    // Search Pixabay for educational-appropriate images
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=illustration&safesearch=true&per_page=3&category=education`
    );
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      const image = data.hits[0];
      return {
        url: image.largeImageURL || image.webformatURL,
        thumbnail: image.previewURL,
        source: 'pixabay',
        attribution: `Image by ${image.user} from Pixabay`
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Pixabay:', error);
    return null;
  }
}

export async function searchMultipleImages(word: string, count: number = 3): Promise<ImageResult[]> {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=illustration&safesearch=true&per_page=${count}&category=education`
    );
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      return data.hits.map((image: any) => ({
        url: image.largeImageURL || image.webformatURL,
        thumbnail: image.previewURL,
        source: 'pixabay' as const,
        attribution: `Image by ${image.user} from Pixabay`
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching from Pixabay:', error);
    return [];
  }
}
