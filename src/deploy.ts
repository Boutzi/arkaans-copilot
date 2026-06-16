import "dotenv/config";
import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "./utils/logger.js";
import type { Command } from "./types/command.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token) throw new Error("DISCORD_BOT_TOKEN is missing from .env");
if (!clientId) throw new Error("CLIENT_ID is missing from .env");

const commands: object[] = [];

const folders = readdirSync(join(__dirname, "commands"));

for (const folder of folders) {
  const files = readdirSync(join(__dirname, "commands", folder)).filter((f) => f.endsWith(".js") || f.endsWith(".ts"));

  for (const file of files) {
    const command: Command = (await import(`./commands/${folder}/${file}`)).default;
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(token);

try {
  logger.info(`Deploying ${commands.length} slash commands...`);
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  logger.info("Slash commands deployed successfully.");
} catch (error) {
  logger.error(error, "Error deploying slash commands");
  process.exit(1);
}
