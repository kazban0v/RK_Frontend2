const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Игнорируем тестовые файлы при сборке
config.resolver.sourceExts.push('tsx', 'ts');
config.resolver.blacklistRE = [
  /.*\.test\..*/, // Игнорируем файлы с расширением .test.tsx или .test.ts
  /.*\.spec\..*/, // Игнорируем файлы с расширением .spec.tsx или .spec.ts
];

module.exports = config;