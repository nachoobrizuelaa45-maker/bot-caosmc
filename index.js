require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('El bot está vivo!'));
app.listen(port, () => console.log(`Servidor activo en el puerto ${port}!`));

const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers 
    ] 
});

client.commands = new Collection();
const PREFIX = '$';
const warningLog = new Map(); 
const ticketCooldown = new Map(); // Sistema de 1 hora

const nivelesRoles = [
    { nivel: 15, id: '1505991923867975782' }, { nivel: 25, id: '1505992194345926736' },
    { nivel: 35, id: '1506012802983399565' }, { nivel: 45, id: '1506016237006880918' },
    { nivel: 55, id: '1506015785951166716' }, { nivel: 65, id: '1506016433061232891' },
    { nivel: 75, id: '1506017790891393206' }, { nivel: 85, id: '1506020394329706537' },
    { nivel: 95, id: '1506019778601554123' }, { nivel: 100, id: '1506017454030327878' },
    { nivel: 150, id: '1506017155928424570' }, { nivel: 200, id: '1506018198984593468' },
    { nivel: 250, id: '1506018334188245193' }, { nivel: 300, id: '1506017999138853147' }
];

global.actualizarRoles = async (member, nivelActual) => {
    const todasLasIds = nivelesRoles.map(r => r.id);
    const rolCorrespondiente = nivelesRoles.filter(r => nivelActual >= r.nivel).pop();
    try {
        await member.roles.remove(todasLasIds).catch(() => {});
        if (rolCorrespondiente) await member.roles.add(rolCorrespondiente.id).catch(() => {});
    } catch (err) { console.error("Error al actualizar roles:", err); }
};

const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./comandos/${file}`);
    client.commands.set(command.name, command);
}

client.once(Events.ClientReady, async (c) => {
    console.log(`🤖 ¡Bot iniciado como ${c.user.tag}!`);
    c.user.setActivity('el Servidor 🌋 CAOSMC 🌋', { type: ActivityType.Watching });
    try {
        await client.application.commands.set([]);
    } catch (error) { console.error('Error al borrar comandos:', error); }
});

client.on(Events.GuildMemberAdd, async (member) => {
    const channelId = '1500269923065401611';
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('bienvenida_btn').setLabel('BIENVENIDO').setStyle(ButtonStyle.Danger).setEmoji('👑').setDisabled(true)
    );
    const embed = new EmbedBuilder()
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(Math.floor(Math.random() * 16777215))
        .setDescription(`¡Bienvenid@ 🎉 <@${member.id}> a ${member.guild.name}!\n\n**Espero que lo pases genial en esta hermosa comunidad**\n\n🟢 Contigo Ahora Somos ${member.guild.memberCount}`)
        .setFooter({ text: `${member.user.username}`, iconURL: member.user.displayAvatarURL() })
        .setTimestamp();
    channel.send({ content: `🛬 **• <@${member.id}> se ha unido.**`, embeds: [embed], components: [row] }).catch(console.error);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    let niveles = JSON.parse(fs.readFileSync('./niveles.json', 'utf8'));
    const userId = message.author.id;
    if (!niveles[userId]) niveles[userId] = { xp: 0, nivel: 1 };
    
    niveles[userId].xp += Math.floor(Math.random() * 3) + 2;
    
    const xpNecesaria = niveles[userId].nivel * 100;
    
    if (niveles[userId].xp >= xpNecesaria) {
        niveles[userId].nivel += 1;
        niveles[userId].xp = 0;
        global.actualizarRoles(message.member, niveles[userId].nivel);
        const canalNiveles = client.channels.cache.get('1510295895625695352');
        if (canalNiveles) canalNiveles.send(`🎉 ¡Felicitaciones <@${userId}>! Has subido al **Nivel ${niveles[userId].nivel}**.`);
    }
    fs.writeFileSync('./niveles.json', JSON.stringify(niveles, null, 2));

    if (!message.member.permissions.has('Administrator')) {
        const MUTE_ROLE_ID = '1511106642341789726';
        if (message.content.includes('http://') || message.content.includes('https://') || message.content.includes('discord.gg')) {
            message.delete().catch(() => {});
            const warnings = warningLog.get(message.author.id) || 0;
            const newCount = warnings + 1;
            warningLog.set(message.author.id, newCount);
            if (newCount >= 3) {
                await message.member.roles.add(MUTE_ROLE_ID);
                message.channel.send(`🚫 ${message.author} has llegado a 3/3 advertencias. Muteado 10 min.`);
                setTimeout(() => { message.member.roles.remove(MUTE_ROLE_ID).catch(() => {}); warningLog.set(message.author.id, 0); }, 600000);
            } else { message.channel.send(`⚠️ ${message.author}, no podés enviar enlaces. Advertencia: ${newCount}/3`); }
            return;
        }
    }

    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `⛔️• error COMANDO ${message.member ? message.member.displayName : message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setColor(0xFF0000)
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(`⌨️•⚠️ Comando **$${commandName}** incorrecto.\n\nℹ️ 🔍 Usa $cmd para ver los comandos.`)
                .setFooter({ text: `${message.author.username}`, iconURL: message.guild.iconURL() })
                .setTimestamp();
            return message.channel.send({ embeds: [embed] }).catch(() => {});
        }

        try { command.execute(message, args); } catch (error) { console.error(error); }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    // --- ABRIR TICKET ---
    if (interaction.customId === 'abrir_ticket') {
        const now = Date.now();
        const cooldownTime = 60 * 60 * 1000;
        const lastTicket = ticketCooldown.get(interaction.user.id);

        if (lastTicket && (now - lastTicket) < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - (now - lastTicket)) / 60000);
            return interaction.reply({ content: `⏳ Tenés que esperar ${timeLeft} minutos para abrir otro ticket.`, ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });
        const ownersRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
        const channel = await interaction.guild.channels.create({
            name: `postulacion-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1511508438528692345',
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ...ownersRoles.map(roleId => ({ id: roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
            ]
        });

        ticketCooldown.set(interaction.user.id, now);
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('cerrar_ticket').setLabel('Cerrar Ticket').setStyle(ButtonStyle.Danger)
        );
        channel.send({ content: `👋 Hola <@${interaction.user.id}>, un staff te atenderá pronto.`, components: [row] });
        await interaction.editReply({ content: `✅ Ticket creado: ${channel}` });
    }

    // --- CERRAR TICKET ---
    if (interaction.customId === 'cerrar_ticket') {
        const ownersRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
        if (!interaction.member.roles.cache.some(r => ownersRoles.includes(r.id))) {
            return interaction.reply({ content: '❌ Solo los Owners pueden cerrar tickets.', ephemeral: true });
        }
        
        await interaction.reply({ content: '🔒 Cerrando ticket...' });
        interaction.channel.send(`⚠️ El ticket ha sido cerrado por un Owner. Se eliminará en 5 segundos.`);
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
    
