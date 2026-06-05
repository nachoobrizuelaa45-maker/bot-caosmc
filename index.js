require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('El bot está vivo!'));
app.listen(port, () => console.log(`Servidor activo en el puerto ${port}!`));

const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require('fs');

// --- CONFIGURACIÓN DE SEGURIDAD GLOBAL ---
global.antiLinksActivado = true;
global.antiBotActivado = true;
global.antiFloodActivado = true;
// ------------------------------------------

// --- PREVENIR CIERRE DEL BOT POR ERRORES ---
process.on('unhandledRejection', (err) => console.error('Error no controlado:', err));
process.on('uncaughtException', (err) => console.error('Excepción no controlada:', err));

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

// --- CARGADOR DE EVENTOS (Poné esto en tu index.js) ---
const eventFiles = fs.readdirSync('./eventos').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./eventos/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
}
// ------------------------------------------------------

const staffGeneralRoles = ['1503125667792027658', '1506026283354685622', '1503127900717846608', '1503127496080490616', '1509940725540847636', '1506026057143156756', '1506013227686039562', '1509746102415392808'];


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

// --- CONFIGURACIÓN DE ROLES (Necesario para que el evento niveles.js funcione) ---
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

// --- SISTEMA DE COMANDOS ---
client.on(Events.MessageCreate, async (message) => {
    // Primero, verificamos que no sea un bot y que empiece con el prefijo
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // Preparamos los argumentos y el nombre del comando
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Si el comando no existe, enviamos el embed de error
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

    // Si todo está bien, intentamos ejecutar el comando
    try { 
        command.execute(message, args); 
    } catch (error) { 
        console.error(error); 
    }
});

// --- SISTEMA DE INTERACCIONES UNIFICADO ---
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    const { customId, user, guild, member } = interaction;

    // 1. VERIFICACIÓN
    if (customId === 'verificar_caosmc') {
        const roleId = '1505990704739123372';
        await interaction.deferReply({ ephemeral: true });
        try {
            await member.roles.add(roleId);
            await interaction.editReply({ content: '✅ ¡Ya te verificaste! Bienvenido a CAOSMC.' });
        } catch (error) { await interaction.editReply({ content: '❌ Error al asignarte el rol.' }); }
        return;
    }

        // 2. TICKETS
    if (customId.startsWith('ticket_')) {
        const cat = customId.replace('ticket_', '');
        if (ticketCooldown.has(user.id) && (Date.now() - ticketCooldown.get(user.id) < 25 * 60 * 1000))
            return interaction.reply({ content: '⏳ Tenés que esperar 25 minutos.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        
        // El nuevo ID que querés que reciba el tag
        let tag = `<@&1512390208145068164>`;
        
        // Roles que pueden ver los tickets (Staff General + Nuevos roles que pediste)
        let rolesPerm = [
            ...staffGeneralRoles, 
            '1512390208145068164' // El rol que querés que vea todo
        ];

        // Lógica específica si es staff, compra o los nuevos tipos
        if (cat === 'staff') { 
            rolesPerm = ['1511522706493935757']; 
            tag = `<@&1511522706493935757>`; 
        }
        else if (cat === 'compra') { 
            rolesPerm = ['1506013227686039562', '1509746102415392808', '1512390208145068164']; 
            tag = `<@&1506013227686039562> <@&1509746102415392808>`; 
        }

        const channel = await guild.channels.create({
            name: `ticket-${cat}-${user.username}`,
            type: ChannelType.GuildText,
            parent: '1511815644717256765',
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                // Esto mapea todos los roles que agregamos arriba para que puedan ver el canal
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
        return;
    }
    
    // 3. POSTULACIONES
    if (customId === 'postulacion_start') {
        if (ticketCooldown.has(user.id) && (Date.now() - ticketCooldown.get(user.id) < 30 * 60 * 1000)) return interaction.reply({ content: '⏳ Espera 30 min.', ephemeral: true });
        await interaction.deferReply({ ephemeral: true });
        const canal = await guild.channels.create({
            name: `postulacion-${user.username}`, type: ChannelType.GuildText, parent: '1511508438528692345',
            permissionOverwrites: [{ id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }, { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }, { id: '1511522706493935757', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }]
        });
        ticketCooldown.set(user.id, Date.now());
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('claim_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('close_ticket').setLabel('Cerrar').setStyle(ButtonStyle.Danger));
        await canal.send({ content: `<@&1511522706493935757>, nueva postulación de <@${user.id}>`, components: [row] });
        await interaction.editReply({ content: `✅ Ticket de postulación creado: ${canal}` });
        return;
    }

    // 4. ACCIONES (RECLAMAR/CERRAR)
    if (customId === 'claim_ticket' || customId === 'close_ticket') {
        await interaction.deferUpdate().catch(() => {});
        if (customId === 'claim_ticket') {
            if (!member.roles.cache.some(r => staffGeneralRoles.includes(r.id))) return;
            await interaction.channel.permissionOverwrites.set([{ id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }, { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }]);
            await interaction.channel.send('✅ Ticket reclamado.');
        } else if (customId === 'close_ticket') {
            await interaction.channel.send('🔒 Cerrando ticket...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
    
        
