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

// IDS DE ROLES
const ownersRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
const staffRoles = ['1506026283354685622', '1503127900717846608', '1503127496080490616', '1509940725540847636', '1506026057143156756'];

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
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Lógica de niveles y moderación...
    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);
        if (!command) return;
        try { command.execute(message, args); } catch (error) { console.error(error); }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // ==========================================
    // SISTEMA 1: POSTULACIÓN STAFF (INTACTO)
    // ==========================================
    if (interaction.customId === 'abrir_ticket') {
        await interaction.deferReply({ ephemeral: true });
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
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('cerrar_postulacion').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
        );
        channel.send({ content: `👋 Hola <@${interaction.user.id}>, un staff te atenderá pronto.`, components: [row] });
        await interaction.editReply({ content: `✅ Ticket creado: ${channel}` });
    }

    if (interaction.customId === 'cerrar_postulacion') {
        if (!interaction.member.roles.cache.some(r => ownersRoles.includes(r.id))) return interaction.reply({ content: '❌ Solo Owners.', ephemeral: true });
        interaction.channel.delete();
    }

    // ==========================================
    // SISTEMA 2: SOPORTE GENERAL CAOSMC (NUEVO)
    // ==========================================
    if (interaction.customId === 'soporte_general') {
        const channel = await interaction.guild.channels.create({
            name: `soporte-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1511508438528692345',
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ...ownersRoles.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] })),
                ...staffRoles.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel] }))
            ]
        });
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('reclamar_ticket').setLabel('Reclamar Ticket').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('cerrar_soporte').setLabel('Cerrar Ticket').setStyle(ButtonStyle.Danger)
        );
        channel.send({ content: `🎫 **SOPORTE CAOSMC** - <@${interaction.user.id}> necesita ayuda.`, components: [row] });
        await interaction.reply({ content: `✅ Ticket de soporte creado: ${channel}`, ephemeral: true });
    }

    if (interaction.customId === 'reclamar_ticket') {
        if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id) || ownersRoles.includes(r.id))) 
            return interaction.reply({ content: '❌ Solo staff.', ephemeral: true });
        
        await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: true });
        await interaction.channel.permissionOverwrites.edit(interaction.member.id, { SendMessages: true });
        await interaction.reply(`✅ Reclamado por <@${interaction.user.id}>.`);
    }

    if (interaction.customId === 'cerrar_soporte') {
        if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id) || ownersRoles.includes(r.id))) 
            return interaction.reply({ content: '❌ No autorizado.', ephemeral: true });
        await interaction.reply('🔒 Cerrando ticket en 5 segundos...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
