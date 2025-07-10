import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry {
  value: string | null;
  timestamp: number;
  ttl: number;
}

export class WikipediaCache {
  private static instance: WikipediaCache;
  private memoryCache = new Map<string, CacheEntry>();
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 часа
  private static readonly CACHE_KEY_PREFIX = 'wikipedia_cache_';

  static getInstance(): WikipediaCache {
    if (!WikipediaCache.instance) {
      WikipediaCache.instance = new WikipediaCache();
    }
    return WikipediaCache.instance;
  }

  private generateKey(plantName: string): string {
    return `${WikipediaCache.CACHE_KEY_PREFIX}${plantName.toLowerCase().trim()}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  async get(plantName: string): Promise<string | null> {
    const key = this.generateKey(plantName);
    
    // Проверяем кэш в памяти
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.value;
    }

    // Проверяем AsyncStorage
    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        const entry: CacheEntry = JSON.parse(storedData);
        if (!this.isExpired(entry)) {
          // Сохраняем в памяти для быстрого доступа
          this.memoryCache.set(key, entry);
          return entry.value;
        } else {
          // Удаляем устаревшую запись
          await AsyncStorage.removeItem(key);
          this.memoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('[Wikipedia Cache] Error reading from storage:', error);
    }

    return null;
  }

  async set(plantName: string, imageUrl: string | null, ttl: number = WikipediaCache.DEFAULT_TTL): Promise<void> {
    const key = this.generateKey(plantName);
    const entry: CacheEntry = {
      value: imageUrl,
      timestamp: Date.now(),
      ttl
    };

    // Сохраняем в память
    this.memoryCache.set(key, entry);

    // Сохраняем в AsyncStorage
    try {
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('[Wikipedia Cache] Error saving to storage:', error);
    }
  }

  async clear(): Promise<void> {
    // Очищаем память
    this.memoryCache.clear();

    // Очищаем AsyncStorage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(WikipediaCache.CACHE_KEY_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('[Wikipedia Cache] Error clearing storage:', error);
    }
  }

  async getCacheStats(): Promise<{ memorySize: number; storageSize: number }> {
    const memorySize = this.memoryCache.size;
    
    let storageSize = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      storageSize = keys.filter(key => key.startsWith(WikipediaCache.CACHE_KEY_PREFIX)).length;
    } catch (error) {
      console.error('[Wikipedia Cache] Error getting storage stats:', error);
    }

    return { memorySize, storageSize };
  }
} 