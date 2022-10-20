import { config } from 'dotenv';
config();
import { Client, Routes, SlashCommandBuilder, ChannelType } from 'discord.js';
import { REST } from '@discordjs/rest';
import schedule from 'node-schedule';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '991045451174264902';

const client = new Client({ intents: [] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Pose ton message.')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Le message à afficher')
        .setMinLength(10)
        .setMaxLength(2000)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('temps')
        .setDescription('Dans combien de temps ?')
        .setChoices(
          { name: '30 seconds', value: 15000 },
          { name: '1 Minute', value: 60000 },
          { name: '15 Minutes', value: 900000 },
          { name: '40 Minutes', value: 2400000 },
          { name: '1 hour', value: 3600000 }
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Le channel dans lequel mettre.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .toJSON(),
];

client.on('ready', () => console.log('Le Bot est bien allumé'));

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'schedule') {
      // handle all the logic for schedule command
      const message = interaction.options.getString('message');
      const time = interaction.options.getInteger('temps');
      const channel = interaction.options.getChannel('channel');

      const date = new Date(new Date().getTime() + time);
      interaction.reply({
        content: `Ton message sera envoyé le ${date.toTimeString()}`,
      });
      console.log(date);
      schedule.scheduleJob(date, () => {
        channel.send({ content: message });
      });
    }
  }
});

async function main() {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();