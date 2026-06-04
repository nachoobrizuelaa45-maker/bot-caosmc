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

// --- SISTEMAS DE BIENVENIDA Y NIVELES ---
client.on(Events.GuildMemberAdd, async (member) => {
    const channel = member.guild.channels.cache.get('1500269923065401611');
    if (!channel) return;
    const embed = new EmbedBuilder().setThumbnail(member.user.displayAvatarURL()).setColor(0xFFD700).setDescription(`¡Bienvenid@ 🎉 <@${member.id}> a ${member.guild.name}!`);
    channel.send({ embeds: [embed] }).catch(console.error);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    let niveles = JSON.parse(fs.readFileSync('./niveles.json', 'utf8'));
    if (!niveles[message.author.id]) niveles[message.author.id] = { xp: 0, nivel: 1 };
    niveles[message.author.id].xp += Math.floor(Math.random() * 3) + 2;
    if (niveles[message.author.id].xp >= niveles[message.author.id].nivel * 100) {
        niveles[message.author.id].nivel += 1;
        niveles[message.author.id].xp = 0;
        global.actualizarRoles(message.member, niveles[message.author.id].nivel);
    }
    fs.writeFileSync('./niveles.json', JSON.stringify(niveles, null, 2));

    if (!message.member.permissions.has('Administrator') && (message.content.includes('http://') || message.content.includes('discord.gg'))) {
        message.delete().catch(() => {});
        message.channel.send(`⚠️ ${message.author}, no podés enviar enlaces.`);
    }

    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = client.commands.get(args.shift().toLowerCase());
        if (command) try { command.execute(message, args); } catch (e) { console.error(e); }
    }
});

// --- SISTEMA DE TICKETS ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const { customId, user, guild } = interaction;

    if (customId.startsWith('ticket_')) {
        const cat = customId.replace('ticket_', '');
        if (ticketCooldown.has(user.id) && (Date.now() - ticketCooldown.get(user.id) < 25 * 60 * 1000))
            return interaction.reply({ content: '⏳ Esperá 25 min para otro ticket.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        
        let rolesPerm = [...staffGeneralRoles];
        let tag = `<@&1503125667792027658>`;

        if (cat === 'staff') { rolesPerm = ['1511522706493935757']; tag = `<@&1511522706493935757>`; }
        else if (cat === 'compra') { rolesPerm = ['1506013227686039562', '1509746102415392808']; tag = `<@&1506013227686039562> <@&1509746102415392808>`; }

        const channel = await guild.channels.create({
            name: `ticket-${cat}-${user.username}`, type: ChannelType.GuildText, parent: '1511815644717256765',
            permissionOverwrites: [{ id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }, { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }, ...rolesPerm.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))]
        });

        ticketCooldown.set(user.id, Date.now());
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
        );
        channel.send({ content: `${tag} Ticket de ${cat} por <@${user.id}>`, components: [row] });
        await interaction.editReply({ content: `✅ Ticket creado: ${channel}` });
    }

    if (customId === 'claim_ticket') {
        if (!interaction.member.roles.cache.some(r => staffGeneralRoles.includes(r.id))) return interaction.reply({ content: '❌ Solo staff.', ephemeral: true });
        await interaction.channel.permissionOverwrites.set([{ id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }, { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }]);
        interaction.reply('✅ Ticket reclamado.');
    }

    if (customId === 'close_ticket') {
        interaction.reply('🔒 Cerrando...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
        
