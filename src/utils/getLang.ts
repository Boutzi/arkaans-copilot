import { prisma } from "./prisma.js";
import type { Language } from "./i18n.js";

const cache = new Map<string, Language>();

export async function getGuildLang(guildId: string): Promise<Language> {
  const cached = cache.get(guildId);
  if (cached) return cached;

  const guild = await prisma.guild.findUnique({
    where: { discordId: guildId },
    select: { language: true },
  });

  const lang = (guild?.language ?? "en") as Language;
  cache.set(guildId, lang);
  return lang;
}

export function setGuildLangCache(guildId: string, lang: Language): void {
  cache.set(guildId, lang);
}
