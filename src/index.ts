import "dotenv/config";
import { logger } from "./utils/logger.js";
import { client } from "./utils/client.js";
import { connectDatabase } from "./utils/prisma.js";
import { loadEvents } from "./handlers/event.js";
import { loadCommands } from "./handlers/command.js";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("TOKEN is missing from .env");

async function main() {
  await loadEvents(client);
  await loadCommands(client);
  await connectDatabase();
  await client.login(token);
}

main().catch((error) => {
  logger.error(error, "Fatal error during startup");
  process.exit(1);
});
