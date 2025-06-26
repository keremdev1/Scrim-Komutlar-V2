const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')
const db = require("codeworld/db")

exports.run = async (client, message, args) => {
    
    if(!message.member.roles.cache.has(db.get(`${message.guild.id}_scrim.yetkilirol`)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Scrim Yetkili Rolü\`** Veya **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }
    const mesajlar = await message.channel.messages.fetch({ limit: 26 });
    const filteredMessages = mesajlar.filter(msg =>
    !msg.author.bot && msg.author.id !== client.user.id && msg.content.trim().length > 0
    );
    const contents = filteredMessages
        .map(msg => msg.content.trim())
        .filter(content => content.length > 0)
        .map(content => `${content}`)
        .join("\n");

    if (!contents) {
        return await message.reply("Son 25 mesajda içerik bulunamadı.");
    }

    await message.channel.send(`${contents}`);
}
exports.conf = {
    aliases: ["otoslot"],
};

exports.help = {
    name: 'oto-slot',
    description: 'Oto Slotları Verir.',
};
