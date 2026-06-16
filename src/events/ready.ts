import { logger } from "../utils/logger.js";
import type { Event } from "../types/event.js";
import { Events } from "discord.js";

const event: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute: (readyClient) => {
    logger.info(`Logged in as ${readyClient.user.tag}!`);
  },
};

export default event;
