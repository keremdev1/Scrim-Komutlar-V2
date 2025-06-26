const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')

exports.run = async (client, message, args) => {

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} `, iconURL: `${client.user.avatarURL()}` })
        .setDescription(`${client.commands.map(cmd => `:white_small_square: [**${prefix}${cmd.help.name}**](https://discord.gg) **→** ${cmd.help.description}`).join("\n ")}`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })
    message.channel.send({ embeds: [embed] })
}
exports.conf = {
    aliases: ["help", "cnd", "h", "y"],
};

exports.help = {
    name: 'yardım',
    description: 'Botun Komutlarını Gösterir.',
};
