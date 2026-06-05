import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  key: string;
  href: string;
  iconName: string;
  translationKey: string;
  badge?: string;
}

/**
 * Navigation items — iconName maps to lucide-react imports in the sidebar component.
 * Keeping this config file free of React imports so it can be used in Server Components.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { key: 'dashboard',          href: '/overview',            iconName: 'LayoutDashboard', translationKey: 'nav.dashboard'          },
  { key: 'cropRecommendation', href: '/crop-recommendation', iconName: 'Sprout',          translationKey: 'nav.cropRecommendation' },
  { key: 'diseaseDetection',   href: '/disease-detection',   iconName: 'Bug',             translationKey: 'nav.diseaseDetection'   },
  { key: 'assistant',          href: '/assistant',           iconName: 'Mic2',            translationKey: 'nav.assistant'          },
  { key: 'market',             href: '/market',              iconName: 'TrendingUp',      translationKey: 'nav.market'             },
  { key: 'farmHealth',         href: '/farm-health',         iconName: 'HeartPulse',      translationKey: 'nav.farmHealth'         },
  { key: 'planner',            href: '/planner',             iconName: 'CalendarDays',    translationKey: 'nav.planner'            },
  { key: 'schemes',            href: '/schemes',             iconName: 'BookOpen',        translationKey: 'nav.schemes'            },
  { key: 'analytics',          href: '/analytics',           iconName: 'BarChart3',       translationKey: 'nav.analytics'          },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { key: 'settings', href: '/settings', iconName: 'Settings', translationKey: 'nav.settings' },
];
