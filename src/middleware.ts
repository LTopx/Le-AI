import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "zh-CN", "zh-HK"],
  // locales: ["en", "zh-CN", "zh-HK", "ja"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

// import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

// export default async function middleware(request: NextRequest) {
//   console.log(request.nextUrl, "request.nextUrl");

//   // Step 1: Use the incoming request
//   const defaultLocale = request.headers.get("x-default-locale") || "en";

//   // Step 2: Create and call the next-intl middleware
//   const handleI18nRouting = createMiddleware({
//     locales: ["en", "zh-CN", "zh-HK", "ja"],
//     defaultLocale,
//   });
//   const response = handleI18nRouting(request);

//   // Step 3: Alter the response
//   response.headers.set("x-default-locale", defaultLocale);

//   return response;
// }
