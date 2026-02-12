import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        const lang = pathname.split('/')[1];
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-lang', lang);

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        return response;
    }

    // Redirect if there is no locale
    return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url)
    );
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!api|_next/static|_next/image|favicon.ico|images|locales|template.xlsx).*)',
    ],
};
