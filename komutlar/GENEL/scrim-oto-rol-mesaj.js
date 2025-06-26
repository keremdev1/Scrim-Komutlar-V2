const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')
const db = require("codeworld/db")
const { RoleSelectMenuBuilder } = require("@discordjs/builders")
const { ChannelSelectMenuBuilder } = require("@discordjs/builders")

exports.run = async (client, message, args) => {
    
    if(!message.member.roles.cache.has(db.get(`${message.guild.id}_scrim.yetkilirol`)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Scrim Yetkili Rolü\`** Veya **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }

    const data = db.get(`${message.guild.id}_otorol_mesaj`) || [];

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`Bu Menülerden Scrim Otorol Mesaj Sistemini Yönetirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })

    const rol = new RoleSelectMenuBuilder()
    .setCustomId("otorol_mesaj_rol")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Scrim Otorol Mesaj Rolü")
    if(data.rol) rol.addDefaultRoles(data.rol)
    
    const kanal = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setCustomId("otorol_mesaj_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Scrim Otorol Mesaj Kanalı")
    if(data.kanal) kanal.addDefaultChannels(data.kanal)
    
    const emoji = new ButtonBuilder()
    .setCustomId("otorol_mesaj_emoji")
    .setLabel("Otorol Mesaj Emoji")
    .setStyle(ButtonStyle.Primary)
    if(data.emoji) emoji.setEmoji(data.emoji)

    const sıfırla = new ButtonBuilder()
    .setCustomId("otorol_mesaj_sıfırla")
    .setLabel("Otorol Mesaj Sıfırla")
    .setStyle(ButtonStyle.Danger)
    if(!data.emoji || !data.kanal || !data.rol) sıfırla.setDisabled(true)

    const rol_row = new ActionRowBuilder().addComponents(rol)
    const kanal_row = new ActionRowBuilder().addComponents(kanal)
    const buton_row = new ActionRowBuilder().addComponents(emoji, sıfırla)

    message.reply({ embeds: [embed], components: [rol_row, kanal_row, buton_row] })
}
exports.conf = {
    aliases: ["scrimotorolmesaj"],
};

exports.help = {
    name: 'scrim-oto-rol-mesaj',
    description: 'Scrim Oto Rol Mesaj Menüsünü Açar.',
};
