import mongoose from "mongoose";
import { env } from "../config/env";

import "../modules/farms/farm.model";
import "../modules/disease-detection/disease.model";

import { runDiseaseRiskAnalysis } from "../jobs/disease-risk.job";

async function main() {
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected. Running disease risk analysis...");

  const result = await runDiseaseRiskAnalysis();
  console.log("Result:", result);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});