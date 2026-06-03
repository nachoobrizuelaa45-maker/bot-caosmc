const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dm',
    execute(message, args) {
        // --- SEGURIDAD: Los mismos roles de Owner ---
        const allowedRoles = ['1509746102415392808', '1506013227686039562'];
        const hasPermission = message.member.roles.cache.some(r => allowedRoles.includes(r.id));
        
        if (!hasPermission) return message.reply('🚫 No tenés permiso.');

        // Buscamos al usuario mencionado
        const member = message.mentions.members.first();
        // Unimos el resto del mensaje para obtener el texto
        const text = args.slice(1).join(' ');

        if (!member || !text) return message.reply('⚠️ Usá: $dm @usuario [mensaje]');

        // Intentamos enviar el mensaje privado
        member.send(text).catch(() => {
            message.reply('❌ No pude enviarle el mensaje (quizás tiene los MD cerrados).').then(msg => setTimeout(() => msg.delete(), 5000));
        });
        
        // Borramos tu comando para que sea secreto y no quede rastro en el canal
        message.delete().catch(() => {});
    }
};
