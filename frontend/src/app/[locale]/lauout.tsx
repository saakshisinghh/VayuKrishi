import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { locales, type Locale, localeMetadata } from '@/lib/i18n/config'
import { ThemeProvider }  from '@/providers/theme-provider'
import { LocaleProvider } from '@/providers/locale-provider'
import { QueryProvider }  from '@/providers/query-provider'
import { AuthProvider }   from '@/providers/auth-provider'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()
  const meta = localeMetadata[locale as Locale]

  return (
    <html lang={locale} dir={meta.dir} suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <LocaleProvider locale={locale as Locale} messages={messages}>
                {children}
              </LocaleProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}