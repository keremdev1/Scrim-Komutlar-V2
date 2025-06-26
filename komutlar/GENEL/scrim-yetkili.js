const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("codeworld/db");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }
    const rol = message.mentions.roles.first();
    if(!rol) {
        return message.reply("Lütfen geçerli bir rol girin.");
    }
    await db.set(`${message.guild.id}_scrim.yetkilirol`, rol.id)
    await message.reply(`**\`${rol.name}\`** Rolü **\`Scrim Yetkilisi\`** Olarak Ayarlandı!`)
};

exports.conf = {
    aliases: ["scrimyetkili"],
};

exports.help = {
    name: 'scrim-yetkili',
    description: 'Scrim Yetkili Rolünü Ayarlar.',
};
