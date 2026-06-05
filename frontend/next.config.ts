import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/locale.ts')

const nextConfig = {}

export default withNextIntl(nextConfig)