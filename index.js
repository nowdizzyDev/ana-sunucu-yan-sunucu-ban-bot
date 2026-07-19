const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs     = require('fs');
const path   = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();
client.config   = config;

const commands    = [];
const cmdDir      = path.join(__dirname, 'commands');
const cmdFiles    = fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'));

for (const file of cmdFiles) {
  const cmd = require(path.join(cmdDir, file));
  if (cmd.data) {
    client.commands.set(cmd.data.name, cmd);
    commands.push(cmd.data.toJSON());
  }
}

const evtDir   = path.join(__dirname, 'events');
const evtFiles = fs.readdirSync(evtDir).filter(f => f.endsWith('.js'));

for (const file of evtFiles) {
  const event = require(path.join(evtDir, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client, config));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client, config));
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client, config);
  } catch (err) {
    console.error(`[BanSync] Komut hatası (${interaction.commandName}):`, err);
    const { buildError, CV2 } = require('./utils/components');
    const { MessageFlags } = require('discord.js');
    const payload = buildError('Bir hata oluştu.');
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ ...payload, flags: CV2 | MessageFlags.Ephemeral }).catch(() => {});
    } else {
      await interaction.reply({ ...payload, flags: CV2 | MessageFlags.Ephemeral }).catch(() => {});
    }
  }
});

client.once('ready', async () => {
  const botAdi = config.botAdi || 'BanSync';
  console.log(`[${botAdi}] ${client.user.tag} hazır.`);

  const rest = new REST({ version: '10' }).setToken(config.token);
  try {
    for (const guildId of [config.anaid, config.yanid]) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, guildId),
        { body: commands }
      );
    }
    console.log(`[${botAdi}] ${commands.length} komut kaydedildi.`);
  } catch (err) {
    console.error(`[${botAdi}] Komut kaydı hatası:`, err);
  }

  client.user.setPresence({
    status: 'dnd',
    activities: [{ name: config.botdurum || 'Ban Sync 🔨', type: 3 }],
  });
});

client.login(config.token);
