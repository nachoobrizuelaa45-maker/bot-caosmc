const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'abrir_ticket') {
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

            const embed = new EmbedBuilder()
                .setTitle('𝐅𝐎𝐑𝐌𝐔𝐋𝐀𝐑𝐈𝐎 𝐃𝐄 𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍 | 𝐂𝐀𝐎𝐒𝐌𝐂')
                .setColor(0xFF0000)
                .setDescription('✨ ᴄᴏᴍᴘʟᴇᴛᴀ ᴛᴏᴅᴀs ʟᴀs ᴘʀᴇɢᴜɴᴛᴀs ᴄᴏɴ sɪɴᴄᴇʀɪᴅᴀᴅ. ʟᴀs ʀᴇsᴘᴜᴇsᴛᴀs ɪɴᴄᴏᴍᴘʟᴇᴛᴀs ᴏ ꜰᴀʟsᴀs ᴘᴏᴅʀᴀ́ɴ sᴇʀ ᴍᴏᴛɪᴠᴏ ᴅᴇ ʀᴇᴄʜᴀᴢᴏ.\n\n👤 **𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋**\nNombre o Nick:\nUsuario de Discord:\nEdad:\nPaís:\nZona horaria:\n\n🎯 **𝐏𝐎𝐒𝐓𝐔𝐋𝐀𝐂𝐈𝐎́𝐍**\n¿A qué cargo te postulas? (Helper, Moderador, Builder, Diseñador, Staff de Eventos, Admin, Staff, Dev)\n\n📖 **𝐏𝐑𝐄𝐆𝐔𝐍𝐓𝐀𝐒**\n¿Por qué quieres formar parte del Staff de CAOSMCCRAFT?\n¿Qué aportarías al servidor?\n¿Cuántas horas puedes dedicar al servidor por semana?\n¿Tienes experiencia previa como Staff? Si es así, explica.\n¿Cómo actuarías ante un jugador que incumple las reglas?\n¿Cómo ayudarías a los nuevos jugadores?\n¿Qué harías si un superior te asigna una tarea importante?\n¿Qué harías si ves a otro Staff abusando de sus permisos?\n¿Cuál consideras que es tu mayor cualidad para este cargo?\n\n📜 **𝐂𝐎𝐌𝐏𝐑𝐎𝐌𝐈𝐒𝐎**\nConfirmas que la información proporcionada es verdadera:\nTe comprometes a respetar a todos los jugadores y miembros del staff:\nTe comprometes a ayudar al crecimiento de CAOSMCCRAFT:\n\n✍️ **𝐅𝐈𝐑𝐌𝐀**\nNombre:\nFirma:\nFecha:');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('reclamar_ticket').setLabel('👔 Reclamar').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('cerrar_ticket').setLabel('🔒 Cerrar').setStyle(ButtonStyle.Danger)
            );

            await canal.send({ content: `<@&1511522706493935757>, nuevo ticket abierto por ${interaction.user}`, embeds: [embed], components: [row] });
            return interaction.reply({ content: `Ticket creado: ${canal}`, ephemeral: true });
        }

        if (interaction.customId === 'reclamar_ticket') {
            await interaction.reply(`Ticket reclamado por ${interaction.user}`);
        }

        if (interaction.customId === 'cerrar_ticket') {
            if (!interaction.member.roles.cache.has('1511522706493935757')) {
                return interaction.reply({ content: 'Solo el Staff puede cerrar esto.', ephemeral: true });
            }
            await interaction.channel.delete();
        }
    }
};
