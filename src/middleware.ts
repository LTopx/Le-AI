import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";

export default createMiddleware({
  locales: ["en", "zh-CN"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
