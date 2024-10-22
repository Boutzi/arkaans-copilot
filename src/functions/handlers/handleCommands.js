const { REST } = require("discord.js");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async (guildid) => {
    client.commands.clear();
    client.commandArray = [];
    const commandFolder = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolder) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }
    const clientId = process.env.CLIENTID;
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildid), {
        body: client.commandArray,
      });
    } catch (error) {
      console.error(error);
    }
  };
};
