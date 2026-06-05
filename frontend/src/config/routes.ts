export const ROUTES = {
  home:               '/',
  login:              '/login',
  register:           '/register',
  otp:                '/otp',
  forgotPassword:     '/forgot-password',

  dashboard:          '/overview',
  cropRecommendation: '/crop-recommendation',
  diseaseDetection:   '/disease-detection',
  assistant:          '/assistant',
  market:             '/market',
  farmHealth:         '/farm-health',
  planner:            '/planner',
  schemes:            '/schemes',
  analytics:          '/analytics',
  profile:            '/profile',
  settings:           '/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
