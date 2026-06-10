import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/locale';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except Next.js internals and static files
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
