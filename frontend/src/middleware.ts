import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecureHeaders } from "@/lib/security";

const intlMiddleware = createMiddleware({
  locales: ["en", "hi", "mr", "gu", "ta", "kn"],
  defaultLocale: "hi",
  localePrefix: "always",
});

export default function middleware(request: NextRequest): NextResponse {
  // 1. Run i18n middleware
  const response = intlMiddleware(request) as NextResponse;

  // 2. Apply secure headers to all responses
  applySecureHeaders(response);

  // 3. Protected dashboard routes — verify auth cookie exists
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.match(/\/[a-z]{2}\/(overview|crop|disease|assistant|market|farm|planner|schemes|analytics|profile|settings)/);
  const hasAuth = request.cookies.has("vk_session");

  if (isDashboard && !hasAuth) {
    const loginUrl = new URL(`/${request.nextUrl.locale ?? "hi"}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|screenshots).*)",
  ],
};
