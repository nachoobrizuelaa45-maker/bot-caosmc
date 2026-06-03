require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('El bot está vivo!'));
app.listen(port, () => console.log(`Servidor activo en el puerto ${port}!`));

const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, ChannelType, PermissionsBitField, StringSelectMenuBuilder } = require('discord.js');
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
    
    if (interaction.isButton() && interaction.customId === 'abrir_ticket') {
        const now = Date.now();
        const cooldownTime = 60 * 60 * 1000;
        const lastTicket = ticketCooldown.get(interaction.user.id);
        if (lastTicket && (now - lastTicket) < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - (now - lastTicket)) / 60000);
            return interaction.reply({ content: `⏳ Tenés que esperar ${timeLeft} minutos.`, ephemeral: true });
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
                ...ownersRoles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
            ]
        });
        ticketCooldown.set(interaction.user.id, now);
        
        const FORMULARIO = `📋 𝐅𝐎𝐑𝐌𝐔𝐋𝐀𝐑𝐈𝐎 𝐃𝐄 𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍 | 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓

✨ ᴄᴏᴍᴘʟᴇᴛᴀ ᴛᴏᴅᴀs ʟᴀs ᴘʀᴇɢᴜɴᴛᴀs ᴄᴏɴ sɪɴᴄᴇʀɪᴅᴀᴅ. ʟᴀs ʀᴇsᴘᴜᴇsᴛᴀs ɪɴᴄᴏᴍᴘʟᴇᴛᴀs ᴏ ꜰᴀʟsᴀs ᴘᴏᴅʀᴀ́ɴ sᴇʀ ᴍᴏᴛɪᴠᴏ ᴅᴇ ʀᴇᴄʜᴀᴢᴏ.

👤 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋
Nombre o Nick:
Usuario de Discord:
Edad:
País:
Zona horaria:

🎯 𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍
¿A qué cargo te postulas? (Helper, Moderador, Builder, Diseñador, Staff de Eventos, Admin, Staff, Dev)

📖 𝐏𝐑𝐄𝐆𝐔𝐍𝐓𝐀𝐒
¿Por qué quieres formar parte del Staff de CAOSMCCRAFT?
¿Qué aportarías al servidor?
¿Cuántas horas puedes dedicar al servidor por semana?
¿Tienes experiencia previa como Staff? Si es así, explica.
¿Cómo actuarías ante un jugador que incumple las reglas?
¿Cómo ayudarías a los nuevos jugadores?
¿Qué harías si un superior te asigna una tarea importante?
¿Qué harías si ves a otro Staff abusando de sus permisos?
¿Cuál consideras que es tu mayor cualidad para este cargo?

📜 𝐂𝐎𝐌𝐏𝐑𝐎𝐌𝐈𝐒𝐎
Confirmas que la información proporcionada es verdadera:
Te comprometes a respetar a todos los jugadores y miembros del staff:
Te comprometes a ayudar al crecimiento de CAOSMCCRAFT:

✍️ 𝐅𝐈𝐑𝐌𝐀
Nombre:
Firma:
Fecha:`;

        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('cerrar_postulacion').setLabel('Cerrar Postulación').setStyle(ButtonStyle.Danger));
        await channel.send({ content: `<@&1509746102415392808> <@&1506013227686039562>\n\n👋 Hola <@${interaction.user.id}>, completá este formulario:\n\`\`\`${FORMULARIO}\`\`\``, components: [row] });
        await interaction.editReply({ content: `✅ Ticket de postulación creado: ${channel}` });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
        const categoria = interaction.values[0];
        const ownersRoles = ['1506013227686039562', '1503125667792027658', '1509746102415392808'];
        const staffRoles = ['1506026283354685622', '1503127900717846608', '1503127496080490616', '1509940725540847636', '1506026057143156756'];
        
        let permisivos = [
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ];

        permisivos.push(...ownersRoles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] })));

        if (categoria !== 'Reportar-Staff') {
            permisivos.push(...staffRoles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] })));
        }

        const channel = await interaction.guild.channels.create({
            name: `${categoria}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1511815644717256765',
            permissionOverwrites: permisivos
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('reclamar_soporte').setLabel('Reclamar Ticket').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('cerrar_soporte').setLabel('Cerrar Ticket').setStyle(ButtonStyle.Danger)
        );
        
        await channel.send({ 
            content: `🎫 **Ticket de: ${categoria}**\nUsuario: <@${interaction.user.id}>\n${categoria === 'Reportar-Staff' ? '⚠️ Canal privado solo para Owners.' : 'Staff y Owners, un momento por favor.'}`, 
            components: [row] 
        });
        await interaction.reply({ content: `✅ Ticket de ${categoria} creado: ${channel}`, ephemeral: true });
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'reclamar_soporte') {
            await interaction.channel.setName(`atendido-${interaction.user.username}`);
            await interaction.reply({ content: `✅ Ticket reclamado por **${interaction.user.username}**. El resto del staff no interrumpir.` });
        }
        if (interaction.customId === 'cerrar_postulacion' || interaction.customId === 'cerrar_soporte') {
            await interaction.reply({ content: '🔒 Cerrando...' });
            setTimeout(() => interaction.channel.delete(), 5000);
        }
    }
});

client.on('messageCreate', async message => {
    if (message.content === '$soporte' && message.member.permissions.has('Administrator')) {
        const embed = new EmbedBuilder()
            .setTitle('🎫 SOPORTE BLOCKRAFTT')
            .setDescription('Selecciona una categoría para abrir un ticket.')
            .setColor(0x2B2D31);
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Selecciona una categoría')
                .addOptions([
                    { label: 'Soporte', value: 'Soporte', description: '¿Necesitas ayuda o alguna duda?', emoji: '🆘' },
                    { label: 'Help', value: 'Help', description: '¿Soporte técnico o dudas?', emoji: '❓' },
                    { label: 'Alianza', value: 'Alianza', description: 'Temas de partner o alianzas mutuas.', emoji: '🤝' },
                    { label: 'Reporte', value: 'Reporte', description: '¿Reportar a un usuario?', emoji: '📁' },
                    { label: 'Reportar Bug', value: 'Reportar-Bug', description: '¿Encontraste algún bug?', emoji: '🔨' },
                    { label: 'Reportar Staff', value: 'Reportar-Staff', description: '¿Quieres reportar a un miembro del staff?', emoji: '👮' }
                ])
        );
        message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.login(process.env.DISCORD_TOKEN);

        
