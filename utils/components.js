const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');

const path = require('path');

const e      = require(path.join(__dirname, '..', 'emoji.json'));
const config = require(path.join(__dirname, '..', 'config.json'));

const BOT_ADI = config.botAdi || 'Ban Sync';

const sep      = () => new SeparatorBuilder().setSpacing(1).setDivider(true);
const sepLarge = () => new SeparatorBuilder().setSpacing(2).setDivider(true);

const CV2 = MessageFlags.IsComponentsV2;

function buildBanLog({ user, reason, trigger, moderator = null }) {
  const ts  = Math.floor(Date.now() / 1000);
  const mod = moderator
    ? `\n${e.yetki} **Yetkili:** <@${moderator.id}>`
    : '';

  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.ban} ${BOT_ADI} — Kullanıcı Banlandı`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${e.user} **Kullanıcı:** <@${user.id}> \`${user.tag}\`\n` +
        `${e.id} **ID:** \`${user.id}\``
      )
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${e.sebep} **Sebep:** ${reason}\n` +
        `${e.sync} **Tetikleyen:** ${trigger}` +
        mod
      )
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${e.time} <t:${ts}:F>`
      )
    );

  return { components: [c], flags: CV2 };
}

function buildUnbanLog({ user, moderator }) {
  const ts = Math.floor(Date.now() / 1000);

  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.unban} ${BOT_ADI} — Kullanıcı Unbanlandı`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${e.user} **Kullanıcı:** <@${user.id}> \`${user.tag ?? user.id}\`\n` +
        `${e.id} **ID:** \`${user.id}\``
      )
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${e.yetki} **Yetkili:** <@${moderator.id}>`
      )
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${e.time} <t:${ts}:F>`
      )
    );

  return { components: [c], flags: CV2 };
}

function buildPing(wsLatency, apiLatency) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.ping} ${BOT_ADI} — Ping`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${e.dot} **WebSocket:** \`${wsLatency}ms\`\n` +
        `${e.dot} **API:** \`${apiLatency}ms\``
      )
    );

  return { components: [c], flags: CV2 };
}

function buildBanList(bans, page, totalPages) {
  const lines = bans.map(b =>
    `${e.dot} \`${b.user.tag}\` — \`${b.user.id}\``
  ).join('\n') || 'Ban listesi boş.';

  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.list} ${BOT_ADI} — Ban Listesi`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(lines)
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${e.sayfa} Sayfa **${page}/${totalPages}**`
      )
    )
    .addSeparatorComponents(sep())
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`banlist_prev_${page}`)
          .setLabel('◀ Önceki')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page <= 1),
        new ButtonBuilder()
          .setCustomId(`banlist_next_${page}`)
          .setLabel('Sonraki ▶')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page >= totalPages),
      )
    );

  return { components: [c], flags: CV2 };
}

function buildSuccess(title, desc) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.basarili} ${BOT_ADI} — ${title}`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(desc)
    );

  return { components: [c], flags: CV2 };
}

function buildError(desc) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${e.hata} ${BOT_ADI} — Hata`)
    )
    .addSeparatorComponents(sepLarge())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(desc)
    );

  return { components: [c], flags: CV2 };
}

module.exports = {
  e,
  sep,
  sepLarge,
  CV2,
  BOT_ADI,
  buildBanLog,
  buildUnbanLog,
  buildPing,
  buildBanList,
  buildSuccess,
  buildError,
};
