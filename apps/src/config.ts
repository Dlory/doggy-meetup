const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '',
};

export default config;
