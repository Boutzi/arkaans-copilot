import { Client, Collection, GatewayIntentBits } from "discord.js";
import "../types/client.js";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();
