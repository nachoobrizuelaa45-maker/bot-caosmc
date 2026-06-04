const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setverificacion',
    description: 'Envía el mensaje de verificación de CAOSMC',
    execute(message, args) {
        // Verificación de seguridad: Solo administradores pueden usar este comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ No tenés permisos para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000') // Color rojo solicitado
            .setTitle('¡Bienvenido a CAOSMC!')
            .setDescription('Para desbloquear todas las funciones y canales del servidor, hacé clic en el botón de abajo.')
            .setFooter({ text: 'Sistema de Seguridad CAOSMC' });

        const boton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verificar_caosmc')
                    .setLabel('VERIFICAR')
                    .setStyle(ButtonStyle.Primary) // Botón azul
            );

        message.channel.send({ embeds: [embed], components: [boton] });
    },
};
