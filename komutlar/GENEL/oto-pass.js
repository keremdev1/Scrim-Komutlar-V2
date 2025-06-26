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

    const data = db.get(`${message.guild.id}_oto_pass`) || [];

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`Bu Menülerden Oto Pass Sistemini Yönetirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })

    const rol = new RoleSelectMenuBuilder()
    .setCustomId("oto_pass_rol")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Oto Pass Rolü")
    if(data.rol) rol.addDefaultRoles(data.rol)

    const mevcutFiltre = 
    data.filtre === "mesaj" 
        ? { label: "Kanalda Mesaj Yazan Herkese Pass Ver", value: "mesaj", default: true }
        : data.filtre === "emoji"
        ? { label: "Mesajında Emojiye Sahip Olanlara Pass Ver", value: "emoji", default: true }
        : null;

    const filtre = new StringSelectMenuBuilder()
    .setCustomId("oto_pass_filtre")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Oto Pass Filtre Ayarla")
    .setOptions([
        mevcutFiltre,
        data.filtre !== "mesaj" ? { label: "Kanalda Mesaj Yazan Herkese Pass Ver", value: "mesaj" } : null,
        data.filtre !== "emoji" ? { label: "Mesajında Emojiye Sahip Olanlara Pass Ver", value: "emoji" } : null
    ].filter(Boolean));
    
    const baslat = new ButtonBuilder()
    .setCustomId("oto_pass_baslat")
    .setLabel("İşlemi Başlat")
    .setStyle(ButtonStyle.Success)
    if(!data.rol || !data.filtre) baslat.setDisabled(true)

    const rol_row = new ActionRowBuilder().addComponents(rol)
    const filtre_row = new ActionRowBuilder().addComponents(filtre)
    const buton_row = new ActionRowBuilder().addComponents(baslat)

    message.reply({ embeds: [embed], components: [rol_row, filtre_row, buton_row] })
}
exports.conf = {
    aliases: ["otopass"],
};

exports.help = {
    name: 'oto-pass',
    description: 'Oto Pass Menüsünü Açar.',
};
