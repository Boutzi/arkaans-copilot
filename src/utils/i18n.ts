import i18next from "i18next";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Locale } from "discord.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadLocale(lang: string): Record<string, string> {
  const raw = readFileSync(join(__dirname, `../locales/${lang}.json`), "utf-8");
  return JSON.parse(raw) as Record<string, string>;
}

export const LANGUAGES = ["en", "fr", "it", "es", "de", "ko", "ja", "zh"] as const;
export type Language = (typeof LANGUAGES)[number];

const resources = Object.fromEntries(
  LANGUAGES.map((lang) => [lang, { translation: loadLocale(lang) }]),
);

await i18next.init({
  resources,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function t(key: string, lng: string, vars?: Record<string, string>): string {
  return i18next.t(key, { lng, ...(vars ?? {}) }) as string;
}

const DISCORD_LOCALE_MAP: Partial<Record<Language, Locale>> = {
  fr: Locale.French,
  it: Locale.Italian,
  es: Locale.SpanishES,
  de: Locale.German,
  ko: Locale.Korean,
  ja: Locale.Japanese,
  zh: Locale.ChineseCN,
};

export function buildLocalizations(key: string): Partial<Record<Locale, string>> {
  return Object.fromEntries(
    Object.entries(DISCORD_LOCALE_MAP).map(([lang, locale]) => [locale, t(key, lang)]),
  ) as Partial<Record<Locale, string>>;
}
