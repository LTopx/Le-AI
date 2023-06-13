import createMiddleware from "next-intl/middleware";
// import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export default createMiddleware({
  locales: ["en", "zh-CN"],
  defaultLocale: "en",
});

// export default async function middleware(request: NextRequest) {
//   console.log(request.nextUrl, "request.nextUrl");

//   // Step 1: Use the incoming request
//   const defaultLocale = request.headers.get("x-default-locale") || "en";

//   // Step 2: Create and call the next-intl middleware
//   const handleI18nRouting = createMiddleware({
//     locales: ["en", "zh-CN"],
//     defaultLocale,
//   });
//   const response = handleI18nRouting(request);

//   // Step 3: Alter the response
//   response.headers.set("x-default-locale", defaultLocale);

//   return response;
// }

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
