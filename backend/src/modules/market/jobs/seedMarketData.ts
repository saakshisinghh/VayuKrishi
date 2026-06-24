/**
 * Standalone seed script — populates the database with mock market
 * data without needing to go through the HTTP /sync endpoint.
 *
 * Usage:
 *   npm run seed:market
 */
import { connectDatabase, disconnectDatabase } from "../../../config/database";
import { logger } from "../../../config/logger";
import { marketRepository } from "../repositories/market.repository";
import { generateMockMarketData, SUPPORTED_COMMODITIES } from "./mockDataGenerator";

async function run(): Promise<void> {
  await connectDatabase();

  const existing = await marketRepository.countAll();
  logger.info(`Existing market records: ${existing}`);

  const records = generateMockMarketData([...SUPPORTED_COMMODITIES], 100, "MOCK");
  const inserted = await marketRepository.insertMany(records);

  logger.info(`Seeded ${inserted.length} mock market records`);

  await disconnectDatabase();
  process.exit(0);
}

run().catch((err) => {
  logger.error("Seed script failed", err);
  process.exit(1);
});
