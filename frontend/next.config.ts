
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts') // ← was locale.ts

const nextConfig = {}

export default withNextIntl(nextConfig)