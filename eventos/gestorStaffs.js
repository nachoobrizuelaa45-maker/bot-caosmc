const { Events, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Mapa para controlar el cooldown de 30 minutos
const staffCooldown = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        
        // Lógica de CIERRE (Esto hace que el sistema sepa que el ticket se cerró)
        if (interaction.customId === 'close_ticket') {
            await interaction.reply({ content: '🔒 Cerrando ticket...', ephemeral: true }).catch(() => {});
            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
            return;
        }

        if (!interaction.customId.startsWith('staff_')) return;

        await interaction.deferReply({ ephemeral: true }).catch(() => {});

        const tipo = interaction.customId.split('_')[1];
        const categoriaID = '1511508438528692345';
        const rolStaff = '1511522706493935757';

        // 1. VERIFICAR SI YA TIENE UN TICKET ABIERTO (Nombre del canal)
        const canalExistente = interaction.guild.channels.cache.find(c => 
            c.parentId === categoriaID && c.name.includes(interaction.user.username)
        );

        if (canalExistente) {
            return interaction.editReply({ 
                content: `❌ **¡Error!** Ya tenés un ticket abierto en ${canalExistente}. Cerralo primero para abrir otro.` 
            }).catch(() => {});
        }

        // 2. VERIFICAR COOLDOWN DE 30 MINUTOS
        const cooldownTime = 30 * 60 * 1000;
        const lastStaffTicket = staffCooldown.get(interaction.user.id);

        if (lastStaffTicket && (Date.now() - lastStaffTicket < cooldownTime)) {
            const tiempoRestante = Math.ceil((cooldownTime - (Date.now() - lastStaffTicket)) / (60 * 1000));
            return interaction.editReply({ 
                content: `⏳ **¡Esperá un poco!** Ya abriste un ticket de Staff recientemente. Tenés que esperar **${tiempoRestante} minutos** para poder abrir otro.` 
            }).catch(() => {});
        }

        // --- FORMULARIOS ---
        const formularios = {
            postular: {
                titulo: '👔 · Formulario de Postulación STAFF',
                desc: `¡Hola <@${interaction.user.id}>! Completá este formulario:\n\n1️⃣ • **Nombre, edad y país:**\n\n2️⃣ • **¿Por qué querés ser staff y cuánto tiempo jugás en CAOSMC?:**\n\n3️⃣ • **¿Cómo actuarías ante un jugador usando hacks o insultando?:**\n\n4️⃣ • **¿Tenés experiencia previa como staff? (Dónde y qué hacías):**\n\n5️⃣ • **¿Cuántas horas diarias podés dedicar al servidor?:**\n\n6️⃣ • **¿Por qué deberíamos elegirte a vos y no a otro?:**`
            },
            reportar: {
                titulo: '📋 · Formulario de Reporte STAFF',
                desc: `¡Hola <@${interaction.user.id}>! Completá los datos del reporte:\n\n📋 • **ID/Nick del Staff reportado:**\n\n⚖️ • **Motivo del reporte:**\n\n📅 • **Fecha y hora del incidente:**\n\n📁 • **Evidencia (Link/Captura/Video):**\n\n👤 • **Nombre/Nick del denunciante:**`
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

        // Registrar el momento de apertura
        staffCooldown.set(interaction.user.id, Date.now());

        const embed = new EmbedBuilder()
            .setAuthor({ name: data.titulo })
            .setDescription(data.desc)
            .setColor(tipo === 'postular' ? 0x00AAFF : 0xFF0000)
            .setFooter({ text: 'CAOSMC CRAFT - Sistema de Tickets' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Cerrar Ticket').setStyle(ButtonStyle.Danger)
        );

        await channel.send({ content: `<@${interaction.user.id}> <@&${rolStaff}>`, embeds: [embed], components: [row] });
        return interaction.editReply({ content: `✅ ¡Tu ticket ha sido creado en ${channel}!` }).catch(() => {});
    }
};
