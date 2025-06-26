const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')
const db = require("codeworld/db")
const { RoleSelectMenuBuilder } = require("@discordjs/builders")
const { ChannelSelectMenuBuilder } = require("@discordjs/builders")
const { StringSelectMenuBuilder } = require("@discordjs/builders")

exports.run = async (client, message, args) => {
    
    if(!message.member.roles.cache.has(db.get(`${message.guild.id}_scrim.yetkilirol`)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Scrim Yetkili Rolü\`** Veya **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }

    const data = db.get(`${message.guild.id}_pass_devir`) || [];

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`Bu Menülerden Pass Devir Sistemini Yönetirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })

    const rol = new RoleSelectMenuBuilder()
    .setCustomId("pass_devir_rol")
    .setMaxValues(9)
    .setMinValues(1)
    .setPlaceholder("Pass Devir Rolü")
    if (data.rol && Array.isArray(data.rol)) rol.setDefaultRoles(data.rol);
    
    const kanal = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setCustomId("pass_devir_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Pass Devir Kanalı")
    if(data.kanal) kanal.addDefaultChannels(data.kanal)

    const rol_row = new ActionRowBuilder().addComponents(rol)
    const kanal_row = new ActionRowBuilder().addComponents(kanal)

    message.reply({ embeds: [embed], components: [rol_row, kanal_row] })
}
exports.conf = {
    aliases: ["passdevir"],
};

exports.help = {
    name: 'pass-devir',
    description: 'Pass Devir Menüsünü Açar.',
};
