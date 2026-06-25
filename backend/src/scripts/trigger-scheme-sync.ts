import mongoose from "mongoose";
import { env } from "../config/env";

import "../modules/farms/farm.model";
import "../modules/schemes/scheme.model";

import { runSchemeSync } from "../jobs/scheme-sync.job";

async function main() {
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected. Running scheme sync...");

  const result = await runSchemeSync();
  console.log("Result:", result);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});