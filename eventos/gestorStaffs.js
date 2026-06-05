const { Events, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('staff_')) return;

        await interaction.deferReply({ ephemeral: true }).catch(() => {});

        const tipo = interaction.customId.split('_')[1]; // postular o reportar
        const categoriaID = '1511508438528692345';
        const rolStaff = '1511522706493935757';

        // --- FORMULARIOS ---
        const formularios = {
            postular: {
                titulo: '👔 · Formulario de Postulación STAFF',
                desc: `¡Hola <@${interaction.user.id}>! Completá este formulario para tu postulación:\n\n` +
                      `1️⃣ • **Nombre, edad y país:**\n\n` +
                      `2️⃣ • **¿Por qué querés ser staff y cuánto tiempo jugás en CAOSMC?:**\n\n` +
                      `3️⃣ • **¿Cómo actuarías ante un jugador usando hacks o insultando?:**\n\n` +
                      `4️⃣ • **¿Tenés experiencia previa como staff? (Dónde y qué hacías):**\n\n` +
                      `5️⃣ • **¿Cuántas horas diarias podés dedicar al servidor?:**\n\n` +
                      `6️⃣ • **¿Por qué deberíamos elegirte a vos y no a otro?:**`
            },
            reportar: {
                titulo: '📋 · Formulario de Reporte STAFF',
                desc: `¡Hola <@${interaction.user.id}>! Por favor, completá los datos del reporte:\n\n` +
                      `📋 • **ID/Nick del Staff reportado:**\n\n` +
                      `⚖️ • **Motivo del reporte:**\n\n` +
                      `📅 • **Fecha y hora del incidente:**\n\n` +
                      `📁 • **Evidencia (Link/Captura/Video):**\n\n` +
                      `👤 • **Nombre/Nick del denunciante:**`
            }
        };

        const data = formularios[tipo];
        if (!data) return;

        // Crear el canal
        const channel = await interaction.guild.channels.create({
            name: `〘${tipo === 'postular' ? '👔' : '📋'}〙•${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoriaID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: rolStaff, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        // Crear el Embed del formulario
        const embed = new EmbedBuilder()
            .setAuthor({ name: data.titulo })
            .setDescription(data.desc)
            .setColor(tipo === 'postular' ? 0x00AAFF : 0xFF0000)
            .setFooter({ text: 'CAOSMC CRAFT - Sistema de Tickets' })
            .setTimestamp();

        // Botón de cierre
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Cerrar Ticket').setStyle(ButtonStyle.Danger)
        );

        // Enviar todo al canal
        await channel.send({ content: `<@${interaction.user.id}> <@&${rolStaff}>`, embeds: [embed], components: [row] });
        
        return interaction.editReply({ content: `✅ ¡Tu ticket ha sido creado en ${channel}!` }).catch(() => {});
    }
};
