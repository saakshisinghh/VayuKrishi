import { env } from " ../config/env";   
import { invalidateCacheByPrefix } from "../modules/analytics/services/analytics.cache";

async function main() {
  await invalidateCacheByPrefix("");
  console.log("Analytics cache cleared.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});