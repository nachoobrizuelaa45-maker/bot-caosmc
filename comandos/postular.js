const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'postular',
    execute(message, args) {
        // --- SEGURIDAD: Solo Owners ---
        const allowedRoles = ['1509746102415392808', '1506013227686039562', '1503125667792027658'];
        const hasPermission = message.member.roles.cache.some(r => allowedRoles.includes(r.id));
        
        if (!hasPermission) return message.reply('🚫 No tenés permiso para usar este comando.');

        const embed = new EmbedBuilder()
            .setTitle('📑 SISTEMA DE RECLUTAMIENTO - CAOSMC')
            .setDescription(
                'El cuerpo administrativo de **CAOSMC** busca nuevos talentos para mantener el orden y la calidad en nuestro servidor.\n\n' +
                '**Requisitos mínimos:**\n' +
                '• Ser activo y responsable.\n' +
                '• Tener conocimiento de los comandos de moderación.\n' +
                '• No poseer antecedentes graves en el servidor.\n\n' +
                'Para iniciar el proceso de postulación, haga clic en el botón inferior. Se le asignará un canal privado donde podrá exponer su solicitud ante los Owners.'
            )
            .setColor(0x2F3136) // Un color gris oscuro más serio
            .setThumbnail(message.guild.iconURL())
            .setFooter({ text: 'CAOSMC - Gestión Administrativa', iconURL: message.guild.iconURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('INICIAR POSTULACIÓN')
                .setStyle(ButtonStyle.Primary) // El botón azul se ve más formal
                .setEmoji('📩')
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
            
