const { ActivityType } = require('discord.js');

module.exports = {
    name: 'setstatus',
    execute(message, args) {
        // --- CONFIGURACIÓN DE ROLES AUTORIZADOS ---
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];
        
        // Verificamos si el miembro tiene alguno de los roles
        const hasPermission = message.member.roles.cache.some(role => allowedRoles.includes(role.id));
        
        if (!hasPermission) {
            return message.reply('🚫 No tenés permisos para cambiar el estado del bot.');
        }

        // --- LÓGICA DEL COMANDO ---
        const type = args[0] ? args[0].toLowerCase() : 'watching';
        const statusText = args.slice(1).join(' ');

        if (!statusText) {
            return message.reply('⚠️ Usá: `$setstatus [playing/watching/listening] [texto]`');
        }

        let activityType;
        if (type === 'playing') activityType = ActivityType.Playing;
        else if (type === 'listening') activityType = ActivityType.Listening;
        else activityType = ActivityType.Watching;

        message.client.user.setActivity(statusText, { type: activityType });
        message.reply(`✅ Estado cambiado a: **${type.toUpperCase()} ${statusText}**`);
    }
};
