require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('El bot está vivo!'));
app.listen(port, () => console.log(`Servidor activo en el puerto ${port}!`));

const { Client, GatewayIntentBits, Collection, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

const ownersRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
const staffRoles = ['1506026283354685622', '1503127900717846608', '1503127496080490616', '1509940725540847636', '1506026057143156756'];
const ticketCooldown = new Map();

client.on('interactionCreate', async interaction => {
    
    // ==========================================================
    // SISTEMA 1: POSTULACIÓN STAFF
    // ==========================================================
    if (interaction.isStringSelectMenu() && interaction.values[0] === 'abrir_ticket') {
        const now = Date.now();
        const cooldownTime = 30 * 60 * 1000;
        const lastTicket = ticketCooldown.get(interaction.user.id);
        if (lastTicket && (now - lastTicket) < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - (now - lastTicket)) / 60000);
            return interaction.reply({ content: `⏳ Tenés que esperar ${timeLeft} minutos para postularte de nuevo.`, ephemeral: true });
        }

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

        ticketCooldown.set(interaction.user.id, now);
        const formulario = `📋 𝐅𝐎𝐑𝐌𝐔𝐋𝐀𝐑𝐈𝐎 𝐃𝐄 𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍 | 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓\n\n[Completá tus datos aquí...]`;
        
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('cerrar_postulacion').setLabel('Cerrar').setStyle(ButtonStyle.Danger));
        channel.send({ content: `<@1506013227686039562> <@1509746102415392808> - Nueva postulación de ${interaction.user}.\n\n${formulario}`, components: [row] });
        return interaction.editReply({ content: `✅ Ticket de postulación creado: ${channel}` });
    }

    // ==========================================================
    // SISTEMA 2: SOPORTE CON BOTONES
    // ==========================================================
    if (interaction.isButton() && interaction.customId.startsWith('btn_')) {
        const tipoTicket = interaction.customId.replace('btn_', '');
        
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.guild.channels.create({
            name: `${tipoTicket}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1511815644717256765',
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ...staffRoles.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel] })),
                ...ownersRoles.map(id => ({ id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle(`🎫 Ticket: ${tipoTicket.toUpperCase()}`)
            .setDescription(`Hola <@${interaction.user.id}>, un staff te atenderá en breve.`)
            .setColor(0xFF4500);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('reclamar_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('cerrar_soporte').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
        );

        channel.send({ embeds: [embed], components: [row] });
        return interaction.editReply({ content: `✅ Ticket creado en ${channel}` });
    }

    // ==========================================================
    // MANEJO DE BOTONES (RECLAMAR/CERRAR)
    // ==========================================================
    if (interaction.isButton()) {
        if (interaction.customId === 'reclamar_ticket') {
            if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id) || ownersRoles.includes(r.id))) 
                return interaction.reply({ content: '❌ Solo staff.', ephemeral: true });
            
            await interaction.channel.permissionOverwrites.set([
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: interaction.member.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]);
            await interaction.reply(`✅ Reclamado por ${interaction.user}. Solo vos podés ver este ticket.`);
        }

        if (interaction.customId === 'cerrar_soporte') {
            if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id) || ownersRoles.includes(r.id))) 
                return interaction.reply({ content: '❌ No autorizado.', ephemeral: true });
            await interaction.reply('🔒 Cerrando ticket...');
            setTimeout(() => interaction.channel.delete(), 3000);
        }

        if (interaction.customId === 'cerrar_postulacion') {
            if (!interaction.member.roles.cache.some(r => ownersRoles.includes(r.id))) return interaction.reply({ content: '❌ Solo Owners.', ephemeral: true });
            interaction.channel.delete();
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
                 
