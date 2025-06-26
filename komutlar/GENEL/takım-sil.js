const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("codeworld/db");

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(db.get(`${message.guild.id}_scrim.yetkilirol`)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply(`Bu Komutu Kullanmak İçin **\`Scrim Yetkili Rolü\`** Veya **\`Yönetici İzni\`** Sahip Olmanız Gerek!`)
    }

    const sayı = parseInt(args[0]);
    if (!sayı || isNaN(sayı) || sayı < 1 || sayı > 25) {
        return message.reply("Lütfen 1 ile 25 arasında bir sayı girin.");
    }
    const mesajlar = await message.channel.messages.fetch({ limit: sayı + 1 });
    const mesajlar_silinecek = [];

    mesajlar.forEach(msg => {
    if (msg.id !== message.id && msg.reactions.cache.size === 0) {
        mesajlar_silinecek.push(msg);
    }
    });

    if (mesajlar_silinecek.length === 0) {
        return message.reply("Belirtilen mesajlar arasında **hiçbir emoji içermeyen** mesaj bulunamadı.");
    }

    try {
        await message.channel.bulkDelete(mesajlar_silinecek, true);
        await message.channel.send(`**\`${mesajlar_silinecek.length}\`** takım silindi.`);
    } catch (err) {
    }
};

exports.conf = {
    aliases: ["takımsil"],
};

exports.help = {
    name: 'takım-sil',
    description: 'Mesajında Emoji Olmayan Takımları Siler.',
};
