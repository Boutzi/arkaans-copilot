import "dotenv/config";
import { REST, Routes } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token) throw new Error("DISCORD_BOT_TOKEN is missing from .env");
if (!clientId) throw new Error("DISCORD_CLIENT_ID is missing from .env");

const GUILD_IDS = ["414420219201847307", "679855172540694537", "1215621537303109684"];

const rest = new REST().setToken(token);

for (const guildId of GUILD_IDS) {
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
  console.log(`Cleared guild commands for ${guildId}`);
}

console.log("Done.");
