require("dotenv").config();

console.clear();
const error = "\x1b[31m";
const warning = "\x1b[33m";
const trace = "\x1b[36m";
const handle = "\x1b[33m";
const reset = "\x1b[0m";
const info = "\x1b[32m";

console.log(error, `=> STARTING DISCORD BOT <=`, reset);
console.log(warning, `NAME: Arkaans Copilot`, reset);
const { TOKEN, DATABASE } = process.env;
const { connect } = require("mongoose");
const { Client, Collection } = require("discord.js");
const fs = require("fs");
const express = require("express");

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

console.log(
  trace,
  `Using token: ${TOKEN ? "Token is present" : "Token is missing"}`,
  reset
);
console.log(
  trace,
  `Connecting to database: ${
    DATABASE ? "Database string is present" : "Database string is missing"
  }`,
  reset
);

const functionFolder = fs.readdirSync(`./src/functions`);
for (const folder of functionFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleComponents();

client.login(TOKEN);
(async () => {
  await connect(DATABASE).catch(console.error);
})();

client.on("guildCreate", (guild) => {
  client.handleCommands(guild.id);
  console.log(`Loaded commands for ${guild.name}`);
});

client.on("ready", () => {
  console.log(trace, `=> HANDLING DISCORD BOT <=`, reset);
  console.log(info, `Logged in as ${client.user.tag}`, reset);
  console.log(trace, `=> HANDLING GUILDS COMMANDS <=`, reset);
  client.guilds.cache.map((guild) => {
    client.handleCommands(guild.id);
    console.log(`|- Loaded commands for ${guild.name}`);
  });
});

const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
