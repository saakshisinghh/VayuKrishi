import mongoose from "mongoose";
import { env } from "../config/env";

import "../modules/farms/farm.model";
import "../modules/market/market.model";

import { runMarketSync } from "../jobs/market-sync.job";

async function main() {
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected. Running market sync...");

  const result = await runMarketSync();
  console.log("Result:", result);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});