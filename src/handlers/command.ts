import { logger } from "../utils/logger.js";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Client } from "discord.js";
import type { Command } from "../types/command.js";
import { isLoadableModule } from "../utils/isLoadable.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client: Client): Promise<void> {
  try {
    let count = 0;
    const folders = readdirSync(join(__dirname, "../commands"));

    for (const folder of folders) {
      const files = readdirSync(join(__dirname, "../commands", folder)).filter(isLoadableModule);

      for (const file of files) {
        const command: Command = (await import(`../commands/${folder}/${file}`)).default;
        if (!command?.data) {
          logger.warn(`Skipping invalid command file: ${file}`);
          continue;
        }
        client.commands.set(command.data.name, command);
        count++;
      }
    }

    logger.info(`Loaded ${count} command${count !== 1 ? "s" : ""}.`);
  } catch (error) {
    logger.error(error, "Error loading commands");
    throw error;
  }
}
