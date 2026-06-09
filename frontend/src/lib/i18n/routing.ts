import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "mr", "gu", "ta", "kn"],
  defaultLocale: "en",
});
