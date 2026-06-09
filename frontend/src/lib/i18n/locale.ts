import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  switch (locale) {
    case "hi":
      messages = (await import("../../messages/hi.json")).default;
      break;
    case "mr":
      messages = (await import("../../messages/mr.json")).default;
      break;
    case "gu":
      messages = (await import("../../messages/gu.json")).default;
      break;
    case "ta":
      messages = (await import("../../messages/ta.json")).default;
      break;
    case "kn":
      messages = (await import("../../messages/kn.json")).default;
      break;
    case "en":
    default:
      messages = (await import("../../messages/en.json")).default;
      break;
  }

  return { locale, messages };
});
