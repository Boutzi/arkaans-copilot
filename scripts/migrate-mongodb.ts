import "dotenv/config";
import { prisma } from "../src/utils/prisma.js";

const channels: Record<string, string> = {
  "679856581978226723": "➕ Create your Kingdom",
  "1513990635982557245": "➕ Minecraft",
  "1513236910804303933": "➕ Board Game Arena",
  "944655482767962182": "➕ Sea of Thieves",
  "816337879172775997": "➕ League of Legends",
  "1319338335822544936": "➕ Lockdown Protocol",
  "1322900897746915328": "➕ Fortnite",
  "943602133448663070": "➕ VALORANT",
};

const guilds: Record<string, string> = {
  "679855172540694537": "𝕃𝕦𝕟𝕒𝕣𝕚 🌙",
  "414420219201847307": "Arkaans",
};

const data = [
  {
    guildId: "679855172540694537",
    channelId: "679856581978226723",
    listInput: [
      "Dragonstone🐉", "Casterly Rock🦁", "Red Keep👑", "Winterfell❄",
      "The Eyrie🦅", "Pyke🦑", "Highgarden🌸", "Dreadfort🩸",
      "Riverrun🐟", "The Twins🏰", "Water Gardens🌞",
    ],
  },
  {
    guildId: "414420219201847307",
    channelId: "1513990635982557245",
    listInput: ["Creeper", "Zombie", "Squelette", "Enderman", "Pillageur", "Warden", "Dragon", "Wither"],
  },
  {
    guildId: "414420219201847307",
    channelId: "1513236910804303933",
    listInput: [
      "Catan", "Terraforming Mars", "Ark Nova", "Kingdomino", "Jaipur",
      "7 Wonders", "Heat", "Forest Shuffle", "Sky Team", "Skull King",
      "dnup", "Courtisans", "Harmonies", "Now boarding",
    ],
  },
  {
    guildId: "414420219201847307",
    channelId: "944655482767962182",
    listInput: [
      "Plunder", "Ancient Spire", "Morrow's Peak", "Galleon's Gave",
      "Sanctuary", "Dagger Tooth", "Port Merrick",
    ],
  },
  {
    guildId: "414420219201847307",
    channelId: "816337879172775997",
    listInput: [
      "Ionia", "Bandle", "Bilgewater", "Demacia", "Freljord",
      "Ixtal", "Le Néant", "Noxus", "Piltover", "Shurima",
      "Targon", "Zaun", "Îles Obscures",
    ],
  },
  {
    guildId: "414420219201847307",
    channelId: "1319338335822544936",
    listInput: ["Pressure", "Vents", "Pizzushi", "Delivery", "Computers", "Analysis", "Scanner", "Alimentations"],
  },
  {
    guildId: "414420219201847307",
    channelId: "1322900897746915328",
    listInput: [
      "Whiffy Wharf", "Flooded Frogs", "Magic Mosses", "Pumped Power", "Demon's Dojo",
      "Twinkle Terrace", "Lost Lake", "Brutal Boxcars", "Nightshift Forest", "Burd",
      "Warrior's Watch", "Foxy Floodgate", "Seaport City", "Shining Span",
      "Shogun's Solitude", "Canyon Crossing", "Masked Meadows", "Hopeful Heights",
    ],
  },
  {
    guildId: "414420219201847307",
    channelId: "943602133448663070",
    listInput: ["Sunset", "Breeze", "Lotus", "Haven", "Ascent", "Split", "Pearl", "Fracture", "IceBox", "Bind", "Abyss"],
  },
];

async function main() {
  console.log(`Migrating ${data.length} channels...`);

  for (const entry of data) {
    const guild = await prisma.guild.upsert({
      where: { discordId: entry.guildId },
      update: {},
      create: { discordId: entry.guildId, guildName: guilds[entry.guildId] ?? "imported" },
    });

    await prisma.sourceChannel.upsert({
      where: { discordId: entry.channelId },
      update: { nameList: entry.listInput },
      create: {
        discordId: entry.channelId,
        sourceChannelName: channels[entry.channelId] ?? "imported",
        nameList: entry.listInput,
        guild: { connect: { id: guild.id } },
      },
    });

    console.log(`✓ guild ${entry.guildId} / channel ${entry.channelId}`);
  }

  console.log("Migration complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
