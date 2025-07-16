const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add SVG support to asset extensions for Expo Image
config.resolver.assetExts.push('svg');

module.exports = config; 