const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'postular',
    execute(message, args) {
        // --- SEGURIDAD: Solo Owners ---
        const allowedRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
        const hasPermission = message.member.roles.cache.some(r => allowedRoles.includes(r.id));
        
        if (!hasPermission) return message.reply('🚫 No tenés permiso para usar este comando.');

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Postulaciones para Staff - CAOSMC')
            .setDescription('¿Querés ser parte del equipo de Staff?\n\n' +
                            '¡Dale al botón de abajo para abrir un ticket privado y completar tu formulario! Los Owners leerán tu solicitud.')
            .setColor(0x00FF00)
            .setThumbnail(message.guild.iconURL());

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('¡Postularme!')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📩')
        );

        // Envía el mensaje y borra el comando $postular original
        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
