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

    const data = db.get(`${message.guild.id}_oto_free_yaz`) || [];

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`Bu Menülerden Oto Free Yaz Sistemini Yönetirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })
    
    const kanal = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setCustomId("oto_free_yaz_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Oto Free Yaz Kanalı")
    if(data.kanal) kanal.addDefaultChannels(data.kanal)

    const baslat = new ButtonBuilder()
    .setCustomId("oto_free_baslat")
    .setLabel("İşlemi Başlat")
    .setStyle(ButtonStyle.Success)
    if(!data.kanal) baslat.setDisabled(true)

    const kanal_row = new ActionRowBuilder().addComponents(kanal)
    const buton_row = new ActionRowBuilder().addComponents(baslat)

    message.reply({ embeds: [embed], components: [kanal_row, buton_row] })
}
exports.conf = {
    aliases: ["otofreeyaz"],
};

exports.help = {
    name: 'oto-free-yaz',
    description: 'Oto Free Yaz Menüsünü Açar.',
};
