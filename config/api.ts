// API Configuration for PermaPeople
// You'll need to get your API keys from PermaPeople and set them here

export const PERMAPEOPLE_CONFIG = {
  // Замените на ваши реальные ключи от PermaPeople
  // Получить ключи можно на: https://permapeople.org/
  KEY_ID: 'byAhd29jmwmA',
  KEY_SECRET: '33a68d62-b06b-4553-9448-d244e39f827c',
};

// Проверка конфигурации
export const isAPIConfigured = (): boolean => {
  return (
    PERMAPEOPLE_CONFIG.KEY_ID !== 'your-key-id-here' &&
    PERMAPEOPLE_CONFIG.KEY_SECRET !== 'your-key-secret-here' &&
    PERMAPEOPLE_CONFIG.KEY_ID.length > 0 &&
    PERMAPEOPLE_CONFIG.KEY_SECRET.length > 0
  );
};

export default PERMAPEOPLE_CONFIG; 