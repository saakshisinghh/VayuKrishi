// import { getRequestConfig } from 'next-intl/server';
// import { routing } from '@/lib/i18n/locale';

// export default getRequestConfig(async ({ requestLocale }) => {
//   let locale = await requestLocale;

//   if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
//     locale = routing.defaultLocale;
//   }

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default,
//   };
// });


import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/lib/i18n/locale';
import fs from 'fs';
import path from 'path';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messagesDir = path.join(process.cwd(), 'src/messages');
  const files = fs.readdirSync(messagesDir).filter(f => f.startsWith(`${locale}.`) && f.endsWith('.json'));

  let messages = {};
  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf-8'));
    messages = { ...messages, ...content };
  }

  return { locale, messages };
});