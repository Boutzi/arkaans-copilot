import type { StringSelectMenuInteraction } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { t, type Language } from "../../utils/i18n.js";
import { getGuildLang, setGuildLangCache } from "../../utils/getLang.js";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  de: "Deutsch",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
};

export async function handleSetLanguageSelect(interaction: StringSelectMenuInteraction): Promise<void> {
  try {
    await interaction.deferUpdate();

    const guildId = interaction.guildId!;
    const newLang = interaction.values[0] as Language;
    const currentLang = await getGuildLang(guildId);

    if (currentLang === newLang) {
      await interaction.editReply({ content: t("SETLANGUAGE_SAME", currentLang), components: [] });
      return;
    }

    await prisma.guild.update({
      where: { discordId: guildId },
      data: { language: newLang },
    });

    setGuildLangCache(guildId, newLang);

    await interaction.editReply({
      content: t("SETLANGUAGE_SUCCESS", newLang, { language: LANGUAGE_NAMES[newLang] }),
      components: [],
    });
  } catch (error) {
    logger.error(error, "Error handling setlanguage select");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: "An error occurred while updating the language.", components: [] });
      }
    } catch {}
  }
}
