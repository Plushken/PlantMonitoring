import { WikipediaCache } from './wikipedia-cache';

interface WikipediaImageResponse {
  query: {
    pages: {
      [key: string]: {
        title: string;
        pageimage?: string;
        thumbnail?: {
          source: string;
          width: number;
          height: number;
        };
      };
    };
  };
}

interface WikipediaSearchResponse {
  query: {
    search: Array<{
      title: string;
      pageid: number;
    }>;
  };
}

// API Request logging


export class WikipediaAPI {
  private static readonly BASE_URL = 'https://en.wikipedia.org/w/api.php';
  private static cache = WikipediaCache.getInstance();
  private static activeRequests = new Map<string, AbortController>();

  static async searchPlantImage(plantName: string, scientificName?: string): Promise<string | null> {
    const searchStartTime = Date.now();
    let requestsMade = 0;

    // Create a unique cache key that includes both names
    const cacheKey = scientificName ? `${plantName}|${scientificName}` : plantName;

    // Проверяем кэш сначала
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult !== null) {
      return cachedResult;
    }

    // Отменяем предыдущий запрос для этого растения
    const existingController = this.activeRequests.get(cacheKey);
    if (existingController) {
      existingController.abort();
    }

    // Создаем новый контроллер для отмены
    const abortController = new AbortController();
    this.activeRequests.set(cacheKey, abortController);

    try {
      // Enhanced search strategies with scientific name priority
      const searchStrategies = [];

      // 1. If we have scientific name, prioritize it (most accurate)
      if (scientificName && scientificName.trim()) {
        searchStrategies.push(
          { method: () => this.getPlantImage(scientificName, abortController.signal), name: `Scientific name: ${scientificName}` },
          { method: () => this.searchWithAPI(scientificName, abortController.signal), name: `Scientific name search: ${scientificName}` }
        );
      }

      // 2. Common name searches
      searchStrategies.push(
        { method: () => this.getPlantImage(plantName, abortController.signal), name: `Common name: ${plantName}` },
        { method: () => this.getPlantImage(`${plantName} plant`, abortController.signal), name: `Common name + "plant": ${plantName} plant` },
        { method: () => this.searchWithAPI(plantName, abortController.signal), name: `Common name search: ${plantName}` }
      );

      // 3. Combined searches if both names are available
      if (scientificName && scientificName.trim() && scientificName !== plantName) {
        searchStrategies.push(
          { method: () => this.searchWithAPI(`${scientificName} ${plantName}`, abortController.signal), name: `Combined search: ${scientificName} ${plantName}` },
          { method: () => this.searchWithAPI(`${plantName} ${scientificName}`, abortController.signal), name: `Combined search: ${plantName} ${scientificName}` }
        );
      }

      for (const strategy of searchStrategies) {
        if (abortController.signal.aborted) {
          return null;
        }

        const result = await strategy.method();
        if (result) {
          // Сохраняем в кэш
          await this.cache.set(cacheKey, result);
          this.activeRequests.delete(cacheKey);
          return result;
        }
      }

      // Сохраняем отрицательный результат в кэш (чтобы не повторять поиск)
      await this.cache.set(cacheKey, null, 60 * 60 * 1000); // 1 час для отрицательных результатов
      this.activeRequests.delete(cacheKey);
      return null;

    } catch (error) {
      this.activeRequests.delete(cacheKey);
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      console.error('[Wikipedia API] Error searching for:', plantName, error);
      return null;
    }
  }

  private static async getPlantImage(plantName: string, signal: AbortSignal): Promise<string | null> {
    try {
      const cleanedName = plantName.trim().replace(/\s+/g, '_');
      const url = `${this.BASE_URL}?action=query&titles=${encodeURIComponent(cleanedName)}&prop=pageimages&format=json&pithumbsize=500`;
      

      
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WikipediaImageResponse = await response.json();
      const pages = data.query.pages;
      const pageIds = Object.keys(pages);
      
      if (pageIds.length === 0) {
        return null;
      }
      
      const page = pages[pageIds[0]];
      
      // Check if page exists and has thumbnail
      if (page.title && !('missing' in page) && page.thumbnail?.source) {
        return page.thumbnail.source;
      }
      
      // If page exists but no thumbnail, try to get images from the page
      if (page.title && !('missing' in page)) {
        return await this.getImagesFromPage(page.title, signal);
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      return null;
    }
  }

  private static async getImagesFromPage(pageTitle: string, signal: AbortSignal): Promise<string | null> {
    try {
      const url = `${this.BASE_URL}?action=query&titles=${encodeURIComponent(pageTitle)}&prop=images&format=json&imlimit=5`;
      
      // Log the request

      
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const pages = data.query.pages;
      const pageIds = Object.keys(pages);
      
      if (pageIds.length === 0) {
        return null;
      }
      
      const page = pages[pageIds[0]];
      if (!page.images || page.images.length === 0) {
        return null;
      }
      
      // Find the first suitable plant image
      for (const image of page.images) {
        if (this.isPlantImage(image.title)) {
          const imageUrl = await this.getImageUrl(image.title, signal);
          if (imageUrl) {
            return imageUrl;
          }
        }
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      return null;
    }
  }

  private static isPlantImage(imageTitle: string): boolean {
    const title = imageTitle.toLowerCase();
    
    // Skip common non-plant images
    const skipPatterns = [
      'commons-logo', 'wikimedia', 'wiki.png', 'edit-icon', 'ambox',
      'question_book', 'crystal', 'nuvola', 'gnome', 'tango', 'emblem',
      'flag', 'coat_of_arms', 'symbol', 'logo', 'icon'
    ];
    
    if (skipPatterns.some(pattern => title.includes(pattern))) {
      return false;
    }
    
    // Prefer images with plant-related keywords
    const plantKeywords = [
      'plant', 'flower', 'leaf', 'tree', 'botanical', 'garden',
      'species', 'bloom', 'blossom', 'foliage', 'stem', 'root', 'seed', 'fruit'
    ];
    
    if (plantKeywords.some(keyword => title.includes(keyword))) {
      return true;
    }
    
    return (title.endsWith('.jpg') || title.endsWith('.png') || title.endsWith('.jpeg'));
  }

  private static async getImageUrl(imageTitle: string, signal: AbortSignal): Promise<string | null> {
    try {
      const url = `${this.BASE_URL}?action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json&iiurlwidth=500`;
      
      // Log the request

      
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const pages = data.query.pages;
      const pageIds = Object.keys(pages);
      
      if (pageIds.length === 0) {
        return null;
      }
      
      const page = pages[pageIds[0]];
      if (page.imageinfo && page.imageinfo.length > 0) {
        const imageInfo = page.imageinfo[0];
        return imageInfo.thumburl || imageInfo.url || null;
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      return null;
    }
  }

  private static async searchWithAPI(query: string, signal: AbortSignal): Promise<string | null> {
    try {
      const url = `${this.BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=3`;
      
      // Log the request

      
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WikipediaSearchResponse = await response.json();
      
      if (data.query.search && data.query.search.length > 0) {
        // Try only the first search result to avoid too many requests
        const firstResult = data.query.search[0];
        return await this.getPlantImage(firstResult.title, signal);
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      return null;
    }
  }

  // Utility method to cancel all active requests
  static cancelAllRequests(): void {
    for (const [plantName, controller] of this.activeRequests) {
      controller.abort();
    }
    this.activeRequests.clear();
  }

  // Utility method to get cache statistics
  static async getCacheStats() {
    return await this.cache.getCacheStats();
  }

  // Utility method to clear cache
  static async clearCache() {
    return await this.cache.clear();
  }
} 