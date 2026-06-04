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
const ticketCooldown = new Map();

// --- CONFIGURACIÓN DE ROLES ---
const nivelesRoles = [
    { nivel: 15, id: '1505991923867975782' }, { nivel: 25, id: '1505992194345926736' },
    { nivel: 35, id: '1506012802983399565' }, { nivel: 45, id: '1506016237006880918' },
    { nivel: 55, id: '1506015785951166716' }, { nivel: 65, id: '1506016433061232891' },
    { nivel: 75, id: '1506017790891393206' }, { nivel: 85, id: '1506020394329706537' },
    { nivel: 95, id: '1506019778601554123' }, { nivel: 100, id: '1506017454030327878' },
    { nivel: 150, id: '1506017155928424570' }, { nivel: 200, id: '1506018198984593468' },
    { nivel: 250, id: '1506018334188245193' }, { nivel: 300, id: '1506017999138853147' }
];

const staffGeneralRoles = ['1503125667792027658', '1506026283354685622', '1503127900717846608', '1503127496080490616', '1509940725540847636', '1506026057143156756', '1506013227686039562', '1509746102415392808'];

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
    try { await client.application.commands.set([]); } catch (error) { console.error(error); }
});

// --- SISTEMA DE BIENVENIDA ---
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

// --- SISTEMA DE MENSAJES, NIVELES Y ADVERTENCIAS ---
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

// --- SISTEMA DE TICKETS ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const { customId, user, guild } = interaction;

    if (customId.startsWith('ticket_')) {
        const cat = customId.replace('ticket_', '');
        if (ticketCooldown.has(user.id) && (Date.now() - ticketCooldown.get(user.id) < 25 * 60 * 1000))
            return interaction.reply({ content: '⏳ Tenés que esperar 25 minutos para abrir otro ticket.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        
        let rolesPerm = [...staffGeneralRoles];
        let tag = `<@&1503125667792027658>`;

        if (cat === 'staff') { rolesPerm = ['1511522706493935757']; tag = `<@&1511522706493935757>`; }
        else if (cat === 'compra') { rolesPerm = ['1506013227686039562', '1509746102415392808']; tag = `<@&1506013227686039562> <@&1509746102415392808>`; }

        const channel = await guild.channels.create({
            name: `ticket-${cat}-${user.username}`,
            type: ChannelType.GuildText,
            parent: '1511815644717256765',
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ...rolesPerm.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
            ]
        });

        ticketCooldown.set(user.id, Date.now());
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
        );
        channel.send({ content: `${tag} Ticket de ${cat} creado por <@${user.id}>.`, components: [row] });
        await interaction.editReply({ content: `✅ Ticket creado en ${channel}` });
    }

    if (customId === 'claim_ticket') {
        if (!interaction.member.roles.cache.some(r => staffGeneralRoles.includes(r.id))) return interaction.reply({ content: '❌ Solo staff.', ephemeral: true });
        await interaction.channel.permissionOverwrites.set([
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]);
        interaction.reply('✅ Ticket reclamado, los demás staff ya no pueden ver este canal.');
    }

    if (customId === 'close_ticket') {
        interaction.reply('🔒 Cerrando ticket...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

// --- VERIFICACIÓN ---
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'verificar_caosmc') {
        const roleId = '1505990704739123372';
        try {
            await interaction.member.roles.add(roleId);
            await interaction.reply({ content: '✅ ¡Ya te verificaste! Bienvenido a CAOSMC.', ephemeral: true });
        } catch (error) {
            console.error('Error al dar el rol de verificación:', error);
            await interaction.reply({ content: '❌ Hubo un error al asignarte el rol. Avisale a un admin.', ephemeral: true });
        }
    }
});

// --- SISTEMA EXCLUSIVO DE POSTULACIÓN (NO TOCAR CON OTROS TICKETS) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const { customId, user, guild, member } = interaction;

    // Solo el ID 1511522706493935757 puede reclamar o cerrar
    const ROL_RECLAMADOR = '1511522706493935757';

    // Iniciar Postulación
    if (customId === 'postulacion_start') {
        if (ticketCooldown.has(user.id) && (Date.now() - ticketCooldown.get(user.id) < 30 * 60 * 1000))
            return interaction.reply({ content: '⏳ Tenés que esperar 30 minutos para postularte.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        
        const canal = await guild.channels.create({
            name: `postulacion-${user.username}`,
            type: ChannelType.GuildText,
            parent: '1511508438528692345',
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: ROL_RECLAMADOR, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: '1505990704739123372', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: '1503130369581650154', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        ticketCooldown.set(user.id, Date.now());

        const embed = new EmbedBuilder()
            .setTitle('📋 𝐅𝐎𝐑𝐌𝐔𝐋𝐀𝐑𝐈𝐎 𝐒𝐓𝐀𝐅𝐅 | 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓')
            .setColor(0x00FF00)
            .setDescription('✨ Completá el formulario con sinceridad para tu postulación:')
            .addFields({ 
                name: '📝 Preguntas', 
                value: `**👤 𝐃𝐀𝐓𝐎𝐒**\nNick / Discord:\nEdad / País:\nCargo:\n\n` +
                       `**🎯 𝐏𝐄𝐑𝐅𝐈𝐋**\n¿Por qué quieres entrar y qué aportarías?:\n¿Tienes experiencia? (Sí/No + breve descripción):\nDisponibilidad (horas semanales):\n\n` +
                       `**⚖️ 𝐂𝐀𝐒𝐎𝐒**\n¿Cómo manejarías a un jugador que rompe reglas o a un staff que abusa de permisos?:\n\n` +
                       `**📜 𝐂𝐎𝐌𝐏𝐑𝐎𝐌𝐈𝐒𝐎**\n¿Aceptas las normas y confirmas que tu info es real? (Sí/No):\n\n` +
                       `**✍️ 𝐅𝐈𝐑𝐌𝐀:**\nNombre:` 
            });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
        );

        await canal.send({ content: `<@&${ROL_RECLAMADOR}>, nueva postulación de <@${user.id}>`, embeds: [embed], components: [row] });
        return interaction.editReply({ content: `✅ Ticket de postulación creado: ${canal}` });
    }

    // Lógica para botones: SOLO el ROL_RECLAMADOR puede usarlos
    if (customId === 'claim_ticket' || customId === 'close_ticket') {
        if (!member.roles.cache.has(ROL_RECLAMADOR)) {
            return interaction.reply({ 
                content: '🚫 ¡Aviso! Solo el staff principal puede reclamar o cerrar este ticket.', 
                ephemeral: true 
            });
        }
        
        if (customId === 'claim_ticket') {
            return interaction.reply({ content: `✅ Ticket reclamado por <@${user.id}>.` });
        } else if (customId === 'close_ticket') {
            return interaction.reply({ content: '🔒 Cerrando ticket...' });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
    
