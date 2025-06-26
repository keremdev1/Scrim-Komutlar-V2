const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')
const db = require("codeworld/db")
const { RoleSelectMenuBuilder } = require("@discordjs/builders")
const { ChannelSelectMenuBuilder } = require("@discordjs/builders")

exports.run = async (client, message, args) => {
    
    if(!message.member.roles.cache.has(db.get(`${message.guild.id}_scrim.yetkilirol`)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Scrim Yetkili Rolü\`** Veya **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }

    const data = db.get(`${message.guild.id}_otorol_buton`) || [];

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`Bu Menülerden Scrim Otorol Buton Sistemini Yönetirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })

    const rol = new RoleSelectMenuBuilder()
    .setCustomId("otorol_buton_rol")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Scrim Otorol Buton Rolü")
    if(data.rol) rol.addDefaultRoles(data.rol)
    
    const kanal = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setCustomId("otorol_buton_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Scrim Otorol Buton Kanalı")
    if(data.kanal) kanal.addDefaultChannels(data.kanal)

    const log = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setCustomId("otorol_buton_log")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Scrim Otorol Buton Log")
    if(data.log) log.addDefaultChannels(data.log)
    
    const baslat = new ButtonBuilder()
    .setCustomId("otorol_buton_baslat")
    .setLabel("Otorol Buton Başlat")
    .setStyle(ButtonStyle.Primary)
    if(!data.log || !data.kanal || !data.rol) baslat.setDisabled(true)

    const sıfırla = new ButtonBuilder()
    .setCustomId("otorol_buton_sıfırla")
    .setLabel("Otorol Buton Sıfırla")
    .setStyle(ButtonStyle.Danger)
    if(!data.log || !data.kanal || !data.rol) sıfırla.setDisabled(true)

    const rol_row = new ActionRowBuilder().addComponents(rol)
    const kanal_row = new ActionRowBuilder().addComponents(kanal)
    const log_row = new ActionRowBuilder().addComponents(log)
    const buton_row = new ActionRowBuilder().addComponents(baslat, sıfırla)

    message.reply({ embeds: [embed], components: [rol_row, kanal_row, log_row, buton_row] })
}
exports.conf = {
    aliases: ["scrimotorolbuton"],
};

exports.help = {
    name: 'scrim-oto-rol-buton',
    description: 'Scrim Oto Rol Buton Menüsünü Açar.',
};
