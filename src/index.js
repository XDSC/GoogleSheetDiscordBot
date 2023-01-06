require("dotenv").config();
const { google } = require("googleapis");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const { DISCORD_BOT_TOKEN, GOOGLE_SPREADSHEET_ID } = process.env;

//Google client config
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const gClient = auth.getClient();
const gSheets = google.sheets({ version: "v4", auth: gClient });

const props = {
  gSheets,
  auth,
  spreadsheetId: GOOGLE_SPREADSHEET_ID,
};

//Discord client config
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client, props);
  }
}

client.handleEvents();
client.handleCommands();
client.login(DISCORD_BOT_TOKEN);
