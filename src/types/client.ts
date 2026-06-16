import type { Collection } from "discord.js";
import type { Command } from "./command.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
