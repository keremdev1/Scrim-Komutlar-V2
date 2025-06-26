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
    const rol = message.mentions.roles.first();
    if(!rol) {
        return message.reply("Lütfen geçerli bir rol girin.");
    }
    const mesajlar = await message.channel.messages.fetch({ limit: sayı + 1 });
    const mesajlar_silinecek = [];

    mesajlar.forEach(msg => {
        const authorMember = message.guild.members.cache.get(msg.author?.id);
        if (
            msg.id !== message.id &&
            authorMember && !authorMember.roles.cache.has(rol.id)
        ) {
            mesajlar_silinecek.push(msg);
        }
    });

    if (mesajlar_silinecek.length === 0) {
        return message.reply("Belirtilen takımlar arasında pass rolüne sahip takım bulunamadı.");
    }

    try {
        await message.channel.bulkDelete(mesajlar_silinecek, true);
        await message.channel.send(`**\`${mesajlar_silinecek.length}\`** takım silindi.`);
    } catch (err) {
    }
};

exports.conf = {
    aliases: ["passolmayansil"],
};

exports.help = {
    name: 'pass-olmayan-sil',
    description: 'Pass Rolü OlmayanTakımları Siler.',
};
