const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
const cooldown = new Map(); // Para los 30 minutos

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'abrir_ticket') {
            // Verificar tiempo de espera
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: '⏳ Esperá 30 minutos antes de abrir otro ticket.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const canal = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: '1511508438528692345',
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    { id: '1511522706493935757', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });

            // Formulario
            const embed = new EmbedBuilder()
                .setTitle('📋 𝐅𝐎𝐑𝐌𝐔𝐋𝐀𝐑𝐈𝐎 𝐃𝐄 𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍 | 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓')
                .setDescription('✨ ᴄᴏᴍᴘʟᴇᴛᴀ ᴛᴏᴅᴀs ʟᴀs ᴘʀᴇɢᴜɴᴛᴀs ᴄᴏɴ sɪɴᴄᴇʀɪᴅᴀᴅ...')
                .addFields({ name: '📝 Preguntas', value: 'Nombre: \nDiscord: \nEdad: \nPaís: \nZona horaria: \nCargo: \n¿Por qué?: \n¿Qué aportarías?: \nHoras: \n¿Experiencia?: \n¿Ante reglas?: \n¿Nuevos?: \n¿Tarea?: \n¿Abuso Staff?: \n¿Cualidad?: \n\n📜 Compromiso:\n¿Verdadero?: \n¿Respeto?: \n¿Crecimiento?: \n\n✍️ Firma: \nNombre: \nFirma: \nFecha: ' });

            // Botones de control
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('reclamar_ticket').setLabel('Reclamar').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('cerrar_ticket').setLabel('Cerrar').setStyle(ButtonStyle.Danger)
            );

            await canal.send({ content: `<@&1511522706493935757>, nuevo ticket de <@${interaction.user.id}>`, embeds: [embed], components: [row] });
            interaction.editReply({ content: `✅ Ticket creado: ${canal}` });

            // Activar cooldown
            cooldown.set(interaction.user.id, Date.now());
            setTimeout(() => cooldown.delete(interaction.user.id), 1800000); 
        }

        // --- SISTEMA DE RECLAMAR Y CERRAR ---
        if (interaction.customId === 'reclamar_ticket' || interaction.customId === 'cerrar_ticket') {
            const esStaff = interaction.member.roles.cache.has('1511522706493935757');
            
            if (interaction.customId === 'reclamar_ticket') {
                if (!esStaff) return interaction.reply({ content: 'Solo el Staff puede reclamar.', ephemeral: true });
                await interaction.channel.permissionOverwrites.edit('1511522706493935757', { SendMessages: false });
                await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: true });
                return interaction.reply(`🎫 Ticket reclamado por ${interaction.user}`);
            }

            if (interaction.customId === 'cerrar_ticket') {
                if (!esStaff) return interaction.reply({ content: 'Solo el Staff puede cerrar.', ephemeral: true });
                return interaction.channel.delete();
            }
        }
    }
};
                              
