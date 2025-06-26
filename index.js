const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color } = require("./ayarlar.js")
const db = require("codeworld/db")
const Discord = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { error } = require("console");
const { StringSelectMenuBuilder } = require("@discordjs/builders");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

    client.user.setPresence({ activities: [{ name: 'moon.offical' }] });

    console.log(`Prefix: ${ayarlar.prefix}`);
    console.log(`Bot Aktif!`);
});

fs.readdir("./komutlar/GENEL", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/GENEL/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})

////////////////////////////////////////// MAİN COMMANDS ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.customId === "otorol_mesaj_rol") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_otorol_mesaj.rol`, i.values[0])
        const data = db.get(`${i.guild.id}_otorol_mesaj`) || [];

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

        i.update({ components: [rol_row, kanal_row, buton_row]})
    }
    if(i.customId === "otorol_mesaj_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_otorol_mesaj.kanal`, i.values[0])
        const data = db.get(`${i.guild.id}_otorol_mesaj`) || [];

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

        i.update({ components: [rol_row, kanal_row, buton_row]})
    }
    if(i.customId === "otorol_mesaj_emoji") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        const modal = new ModalBuilder()
        .setCustomId("otorol_mesaj_emoji_modal")
        .setTitle("Otorol Emojisini Yazın")
        .setComponents(
            new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("emoji")
            .setLabel("Emojinin İdsini Girin")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            )
        )
        await i.showModal(modal)
    }
    if(i.customId === "otorol_mesaj_emoji_modal") {
        const emojiId = await i.fields.getTextInputValue("emoji")
        if (!/^\d+$/.test(emojiId)) {
            return await i.reply({ content: 'Lütfen Sadece Emoji İdsi Girin!', ephemeral: true });
        }
        await db.set(`${i.guild.id}_otorol_mesaj.emoji`, emojiId)
        const data = db.get(`${i.guild.id}_otorol_mesaj`) || [];

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

        i.update({ components: [rol_row, kanal_row, buton_row]})
    }
    if(i.customId === "otorol_mesaj_sıfırla") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.delete(`${i.guild.id}_otorol_mesaj`)
        const data = db.get(`${i.guild.id}_otorol_mesaj`) || [];

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

        i.update({ components: [rol_row, kanal_row, buton_row]})
    }
})

client.on("messageCreate", async m => {
    const data = db.get(`${m.guild.id}_otorol_mesaj`) || [];
    if(!data.emoji || !data.kanal || !data.rol) return;
    if(m.author.bot) return;
    if(m.channel.id !== data.kanal) return;
    if (m.member.roles.highest.position >= m.guild.members.me.roles.highest.position) {
        return m.reply("Yetkim Yetmediği İçin İşlem İptal Oldu!");
    }
    const rol = await m.guild.roles.fetch(data.rol)
    if(!rol) return;
    const nick = `${m.content} | ${m.member.user.globalName}`
    if(nick.length > 32) {
        const m2 = await m.reply("İsminiz 32 Harften Uzun Olduğu İçin İşlem İptal Oldu!")
        await m.delete()
        setTimeout(m2.delete(), 5000)
        return
    }
    await m.member.setNickname(nick)
    await m.member.roles.add(rol)
    await m.react(data.emoji)
})

////////////////////////////////////////// OTOROL BUTON ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.customId === "otorol_buton_rol") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_otorol_buton.rol`, i.values[0])
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];

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

        i.update({ components: [rol_row, kanal_row, log_row, buton_row]})
    }
    if(i.customId === "otorol_buton_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_otorol_buton.kanal`, i.values[0])
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];

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

        i.update({ components: [rol_row, kanal_row, log_row, buton_row]})
    }
    if(i.customId === "otorol_buton_log") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_otorol_buton.log`, i.values[0])
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];

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

        i.update({ components: [rol_row, kanal_row, log_row, buton_row]})
    }
    if(i.customId === "otorol_buton_sıfırla") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.delete(`${i.guild.id}_otorol_buton`)
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];

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

        i.update({ components: [rol_row, kanal_row, log_row, buton_row]})
    }
    if(i.customId === "otorol_buton_baslat") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];
        if(!data.rol || !data.log || !data.kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Ayarlarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const rol = await i.guild.roles.fetch(data.rol)
        if(!rol) {
            return await i.reply({ content: "Scrim Otorol Buton Rol Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const kanal = await i.guild.channels.fetch(data.kanal)
        if(!kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Kanal Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const log = await i.guild.channels.fetch(data.log)
        if(!log) {
            return await i.reply({ content: "Scrim Otorol Buton Log Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const embed = new EmbedBuilder()
        .setAuthor({ name: i.guild.name, iconURL: i.guild.iconURL() })
        .setColor(color)
        .setThumbnail(i.guild.iconURL())
        .setDescription(`${rol} rolünü alabilmek için, lütfen aşağıdaki **"Rol Al"** butonuna tıklayınız. Açılan formda takım isminizi girip formu göndermeniz yeterli olacaktır.`)
        .setFooter({ text: i.guild.name, iconURL: i.guild.iconURL() })
        .setTimestamp()
        const buton = new ButtonBuilder()
        .setCustomId("scrim_oto_rol_buton")
        .setLabel("Rol Al")
        .setStyle(ButtonStyle.Secondary)

        const buton_row = new ActionRowBuilder().addComponents(buton)
        
        await kanal.send({ embeds: [embed], components: [buton_row] })
        await i.reply({ content: "Sistem Aktif Edildi!", ephemeral: true })
    }
    if(i.customId === "scrim_oto_rol_buton") {
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];
        if(!data.rol || !data.log || !data.kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Ayarlarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const rol = await i.guild.roles.fetch(data.rol)
        if(!rol) {
            return await i.reply({ content: "Scrim Otorol Buton Rol Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const kanal = await i.guild.channels.fetch(data.kanal)
        if(!kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Kanal Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const log = await i.guild.channels.fetch(data.log)
        if(!log) {
            return await i.reply({ content: "Scrim Otorol Buton Log Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const modal = new ModalBuilder()
        .setCustomId("otorol_buton")
        .setTitle("Takım İsminizi Yazın")
        .setComponents(
            new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("isim")
            .setLabel("Takım İsminizi Yazın")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            )
        )
        await i.showModal(modal)
    }
    if(i.customId === "otorol_buton") {
        const team = await i.fields.getTextInputValue("isim")
        const data = db.get(`${i.guild.id}_otorol_buton`) || [];
        if(!data.rol || !data.log || !data.kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Ayarlarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const rol = await i.guild.roles.fetch(data.rol)
        if(!rol) {
            return await i.reply({ content: "Scrim Otorol Buton Rol Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const kanal = await i.guild.channels.fetch(data.kanal)
        if(!kanal) {
            return await i.reply({ content: "Scrim Otorol Buton Kanal Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const log = await i.guild.channels.fetch(data.log)
        if(!log) {
            return await i.reply({ content: "Scrim Otorol Buton Log Ayarını Yapmadan Başlayamasın", ephemeral: true})
        }
        const nick = `${team} | ${i.member.user.globalName}`
        if(nick.length > 32) {
            return await i.reply({ content: "İsminiz 32 Harften Uzun Olamaz!", ephemeral: true })
        }
        await i.member.setNickname(nick)
        await i.member.roles.add(rol)
        const embed = new EmbedBuilder()
        .setAuthor({ name: i.guild.name , iconURL: i.guild.iconURL() })
        .setThumbnail(i.guild.iconURL())
        .setDescription(`Sunucudaki ismin **${nick}** Dalton olarak düzenlendi ve ${rol} rolü üzerine verildi.`)
        .setFooter({ text: i.guild.name, iconURL: i.guild.iconURL() })
        .setTimestamp()

        const embed_log = new EmbedBuilder()
        .setAuthor({ name: i.guild.name , iconURL: i.guild.iconURL() })
        .setThumbnail(i.guild.iconURL())
        .setDescription(`${i.member} kullanıcısı, **Rol Al** butonuna bastığı için ismi **${nick}** olarak düzenlendi ve ${rol} rolü üzerine verildi.`)
        .setFooter({ text: i.guild.name, iconURL: i.guild.iconURL() })
        .setTimestamp()

        await i.reply({ embeds: [embed], ephemeral: true })
        await log.send({ embeds: [embed_log], ephemeral: true })
    }
})

////////////////////////////////////////// OTO PASS ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.customId === "oto_pass_rol") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_oto_pass.rol`, i.values[0])
        const data = db.get(`${i.guild.id}_oto_pass`) || [];

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

        await i.update({ components: [rol_row, filtre_row, buton_row]})
    }
    if(i.customId === "oto_pass_filtre") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_oto_pass.filtre`, i.values[0])
        const data = db.get(`${i.guild.id}_oto_pass`) || [];

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

        await i.update({ components: [rol_row, filtre_row, buton_row]})
    }
    if(i.customId === "oto_pass_baslat") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        const data = db.get(`${i.guild.id}_oto_pass`) || [];
        if(!data.rol || !data.filtre) {
            return i.reply({ content: "Butonu Kullanmak İçin Ayarları Yapnaız Gerek!", ephemeral: true })
        }
        const rol = await i.guild.roles.fetch(data.rol)
        if(!rol) {
            return i.reply({ content: "Bu Butonu Kullanmak İçin Geçerli Bir Pass Rolü Ayarlayın!", ephemeral: true })
        }
        const modal = new ModalBuilder()
        .setCustomId("oto_pass")
        .setTitle("Kaç Kişiye Pass Verilecek")
        .setComponents(
            new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("isim")
            .setLabel("Kaç Kişiye Pass Verilecek")
            .setPlaceholder("Maks 25")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            )
        )
        await i.showModal(modal)
    }
    if (i.customId === "oto_pass") {
        const sayı = parseInt(await i.fields.getTextInputValue("isim"));
        const data = db.get(`${i.guild.id}_oto_pass`) || [];

        if (!data.rol || !data.filtre) {
            return await i.reply({ content: "Oto Pass ayarlarını yapmadan başlayamazsın.", ephemeral: true });
        }

        const rol = await i.guild.roles.fetch(data.rol);
        if (!rol) {
            return await i.reply({ content: "Oto Pass rol ayarını yapmadan başlayamazsın.", ephemeral: true });
        }

        const messages = await i.channel.messages.fetch({ limit: 100 });
        const filteredMessages = messages.filter(msg => !msg.author.bot && msg.author.id !== i.user.id);

        if (data.filtre === "mesaj") {
            const userMessageCounts = new Map();

            filteredMessages.forEach(msg => {
                const count = userMessageCounts.get(msg.author.id) || 0;
                userMessageCounts.set(msg.author.id, count + 1);
            });

            const eligibleUsers = [...userMessageCounts.entries()].filter(([id, count]) => count >= sayı);

            eligibleUsers.forEach(async ([userId]) => {
                const member = await i.guild.members.fetch(userId).catch(() => null);
                if (member && !member.roles.cache.has(rol.id)) {
                    await member.roles.add(rol).catch(() => {});
                }
            });

            await i.reply({ content: `Toplam ${eligibleUsers.length} kullanıcıya rol verildi.`, ephemeral: true });

        } else if (data.filtre === "emoji") {
            const reactedUsers = new Set();

            for (const msg of filteredMessages.values()) {
                if (msg.reactions.cache.size > 0) {
                    reactedUsers.add(msg.author.id);
                }
            }

            const eligibleUsers = [...reactedUsers];

            eligibleUsers.forEach(async (userId) => {
                const member = await i.guild.members.fetch(userId).catch(() => null);
                if (member && !member.roles.cache.has(rol.id)) {
                    await member.roles.add(rol).catch(() => {});
                }
            });

            await i.reply({ content: `Tepki bulunan ${eligibleUsers.length} kullanıcıya rol verildi.`, ephemeral: true });
        }
    }
})

////////////////////////////////////////// PASS DEVİR ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.customId === "pass_devir_rol") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        i.values.forEach(value => { db.push(`${i.guild.id}_pass_devir.rol`, value); });
        const data = db.get(`${i.guild.id}_pass_devir`) || [];

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

        i.update({ components: [rol_row, kanal_row] })
    }
    if(i.customId === "pass_devir_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        db.set(`${i.guild.id}_pass_devir.kanal`, i.values[0])
        const data = db.get(`${i.guild.id}_pass_devir`) || [];

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

        i.update({ components: [rol_row, kanal_row] })
    }
})

client.on("messageCreate", async m => {
    const data = db.get(`${m.guild.id}_pass_devir`) || {};
    if (!data.kanal || !Array.isArray(data.rol)) return;
    if(m.author.bot) return;
    if (m.channel.id !== data.kanal) return;
    const passRoller = (await Promise.all(
    data.rol.slice(0, 9).map(id => m.guild.roles.fetch(id).catch(() => null))
    )).filter(role => role);
    const kullanıcıRolleri = passRoller.filter(role => m.member.roles.cache.has(role.id));
      const üye = m.mentions.members.first();
      console.log(kullanıcıRolleri.length)
      if (!üye) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: m.guild.name , iconURL: m.guild.iconURL() })
        .setThumbnail(m.guild.iconURL())
        .setFooter({ text: m.guild.name, iconURL: m.guild.iconURL() })
        .setTimestamp()
        .setDescription(`Lütfen geçerli bir kullanıcı etiketleyin.`);

        return m.reply({ embeds: [embed] });
      }
      if (kullanıcıRolleri.length === 0) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: m.guild.name , iconURL: m.guild.iconURL() })
        .setThumbnail(m.guild.iconURL())
        .setFooter({ text: m.guild.name, iconURL: m.guild.iconURL() })
        .setTimestamp()
        .setDescription(`Geçerli bir pass rolünüz yok.`);

        return m.reply({ embeds: [embed] });
      }
      for (const rol of kullanıcıRolleri) {
        await üye.roles.add(rol).catch(() => {});
        await m.member.roles.remove(rol).catch(() => {});
      }
      const embed = new EmbedBuilder()
        .setAuthor({ name: m.guild.name , iconURL: m.guild.iconURL() })
        .setThumbnail(m.guild.iconURL())
        .setFooter({ text: m.guild.name, iconURL: m.guild.iconURL() })
        .setTimestamp()
        .setDescription(`Sahip olduğunuz **${kullanıcıRolleri.length}** (${kullanıcıRolleri.map(rol => `<@&${rol.id}>`).join(" ,")}) pass rolü başarıyla ${üye} kullanıcısına devredildi.`);
      return m.reply({ embeds: [embed] });
})

////////////////////////////////////////// OTO FREE YAZ ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.customId === "oto_free_yaz_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        await db.set(`${i.guild.id}_oto_free_yaz.kanal`, i.values[0])
        const data = db.get(`${i.guild.id}_oto_free_yaz`) || [];

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

        i.update({ embeds: [embed], components: [kanal_row, buton_row] })
    }
    if(i.customId === "oto_free_baslat") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply({ content: "Bu Etkileşimi Sadece Komutu Çağıran Kullanabilir!", ephemeral: true})
        }
        const data = db.get(`${i.guild.id}_oto_free_yaz`) || [];
        if(!data.kanal) {
            return await i.reply({ content: "Oto free kanal ayarını yapmadan başlayamazsın.", ephemeral: true });
        }
        const kanal = await i.guild.channels.fetch(data.kanal)
        if(!kanal) {
            return await i.reply({ content: "Oto free kanal geçersiz!", ephemeral: true });
        }
        const modal = new ModalBuilder()
        .setCustomId("oto_free")
        .setTitle("Kaç Takım Oto Yazılacak")
        .setComponents(
            new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("isim")
            .setLabel("Kaç Takım Oto Yazılacak")
            .setPlaceholder("Maks 25")
            .setRequired(true)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            )
        )
        await i.showModal(modal)
    }
    if(i.customId === "oto_free") {
        const data = db.get(`${i.guild.id}_oto_free_yaz`) || {};
        if(!data.kanal) {
            return await i.reply({ content: "Oto free kanal ayarını yapmadan başlayamazsın.", ephemeral: true });
        }
        const kanal = await i.guild.channels.fetch(data.kanal).catch(() => null);
        if(!kanal || !kanal.isTextBased()) {
            return await i.reply({ content: "Oto free kanal geçersiz!", ephemeral: true });
        }
        const sayı = parseInt(i.fields.getTextInputValue("isim")) + 1;
        const mesajlar = await i.channel.messages.fetch({ limit: sayı });
        const mesajlar2 = new Set();
        for(const msg of mesajlar.values()) {
            if(msg.content) {
                mesajlar2.add(`${msg.content}\n${msg.member}`);
            }
        }
        for (const içerik of mesajlar2) {
            kanal.send(içerik).catch(console.error);
        }
        await i.reply({ content: "Oto Freeler Yazıldı!", ephemeral: true });
    }
})