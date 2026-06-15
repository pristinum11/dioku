import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

async function testDb() {
  console.log("Connecting to database...\n");

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Basic connectivity
    const [{ version }] = await prisma.$queryRaw<[{ version: string }]>`SELECT version()`;
    console.log("✓ Connected");
    console.log(" ", version, "\n");

    // 2. List all public tables
    const tables = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name::text
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log("⚠ No tables found — run migrations first:");
      console.log("  npx prisma migrate dev --name init\n");
    } else {
      console.log(`✓ Tables (${tables.length}):`);
      for (const { table_name } of tables) {
        console.log(" ", table_name);
      }
      console.log();
    }

    // 3. Quick count on core tables (only if they exist)
    const tableNames = tables.map((t) => t.table_name);
    const coreTables = ["User", "Item", "Collection", "ItemType", "Tag"] as const;

    const existing = coreTables.filter((t) => tableNames.includes(t));
    if (existing.length > 0) {
      console.log("✓ Row counts:");
      for (const table of existing) {
        const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
          `SELECT COUNT(*) as count FROM "${table}"`
        );
        console.log(`  ${table}: ${count}`);
      }
    }

    console.log("\nDatabase connection OK.");
  } catch (error) {
    console.error("✗ Database test failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDb();
