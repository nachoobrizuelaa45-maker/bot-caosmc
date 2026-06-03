const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'darrol',
    execute(message, args) {
        // Eliminar el mensaje del usuario apenas ejecuta el comando
        message.delete().catch(() => {});

        const allowedRoles = ['1509746102415392808', '1506013227686039562'];
        const hasPermission = message.member.roles.cache.some(role => allowedRoles.includes(role.id));
        
        if (!hasPermission) return message.reply('🚫 No tenés permisos.').then(msg => setTimeout(() => msg.delete(), 5000));

        const target = message.mentions.members.first();
        const role = message.mentions.roles.first();

        if (!target || !role) return message.reply('⚠️ Usá: $darrol @usuario @rol').then(msg => setTimeout(() => msg.delete(), 5000));

        target.roles.add(role).then(() => {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(`✅ Se le otorgó el rol ${role} a ${target.user}`);
            message.channel.send({ embeds: [embed] });
        }).catch(() => message.reply('❌ Error al dar el rol.'));
    }
};
