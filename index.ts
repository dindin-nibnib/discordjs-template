import fs = require('node:fs');
import path = require('node:path');

import { SlashCommandBuilder } from '@discordjs/builders';
import "reflect-metadata";
import { Intents } from "discord.js";
import Discord = require("discord.js");
import Discordx = require("discordx");
import { randomInt } from "crypto";
import dotenv = require('dotenv');

dotenv.config();

const token = process.env.TOKEN;

if (token === undefined) {
    process.exit(-1);
}

/**
 * Gives an hour / date string to locate an action in time
 * @returns {String} The date and hour, to use in the console, for example.
 */
function dateNow(): String {
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    let cHour = currentDate.getHours()
    let cMinutes = currentDate.getMinutes()
    let cSeconds = currentDate.getSeconds()
    let cMilisecs = currentDate.getMilliseconds()
    return `[${cMonth}-${cDay}-${cYear} ${cHour}:${cMinutes} ${cSeconds}.${cMilisecs}]`;
}

// Redeclares Client in order to add a collection of commands
// Seems complicated but it's just long type names so that intellisense understands it
class Client extends Discordx.Client {
    commands = new Discord.Collection<string, {
        data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
        execute(interaction: Discord.CommandInteraction<Discord.CacheType>, client: Client): Promise<void>;
    }>();
}

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
    console.log("Ready!")
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("messageCreate", (message) => {
    // To avoid bot loop (bot answering to itself)
    if (message.author.bot)
        return;

    // Write code to run for each message sent
});

client.login(token);