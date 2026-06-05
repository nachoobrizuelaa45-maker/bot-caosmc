const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setverificacion',
    execute(message, args) {
        // Verificamos si tiene permisos para usarlo (opcional, por seguridad)
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ No tenés permisos para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setTitle("VERIFICACIÓN")
            .setDescription("📢 Gracias por ser parte de CAOSMC | Equipo de Soporte 💻\n\nPresioná el botón de abajo para tener acceso a todos los canales.")
            .setColor(0x00FF00); // Color verde

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verificar_caosmc')
                .setLabel('Verificate')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {}); // Borra el mensaje del comando
    }
};
