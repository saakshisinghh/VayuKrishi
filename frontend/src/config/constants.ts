export const APP_NAME = 'Vayukrishi' as const;
export const APP_TAGLINE = 'AI-powered farming intelligence' as const;
export const APP_VERSION = '1.0.0' as const;

export const SIDEBAR_WIDTH_EXPANDED  = 256 as const;
export const SIDEBAR_WIDTH_COLLAPSED = 64  as const;
export const NAVBAR_HEIGHT           = 60  as const;

export const BREAKPOINTS = {
  sm:   640,
  md:   768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

export const OTP_LENGTH          = 6 as const;
export const OTP_EXPIRY_SECONDS  = 300 as const;
export const SESSION_TIMEOUT_MS  = 30 * 60 * 1000 as const;
