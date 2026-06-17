import { logger } from "../utils/logger.js";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Client } from "discord.js";
import type { Event } from "../types/event.js";
import { isLoadableModule } from "../utils/isLoadable.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client: Client): Promise<void> {
  try {
    const files = readdirSync(join(__dirname, "../events")).filter(isLoadableModule);

    for (const file of files) {
      const event: Event<any> = (await import(`../events/${file}`)).default;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
    logger.info(`Loaded ${files.length} event${files.length === 1 ? "" : "s"}.`);
  } catch (error) {
    logger.error(error, "Error loading events");
    throw error;
  }
}
