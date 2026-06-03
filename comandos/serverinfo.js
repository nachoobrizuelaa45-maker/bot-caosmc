module.exports = {
    name: 'serverinfo',
    execute(message, args) {
        const OWNER_ID = 'TU_ID_DE_DISCORD_AQUI';
        if (message.author.id !== OWNER_ID) return message.reply('🚫 Comando exclusivo para el Owner.');

        message.reply(`📊 **Info de CAOSMC:**\n` +
                      `👥 Miembros: ${message.guild.memberCount}\n` +
                      `🏷️ Canales: ${message.guild.channels.cache.size}\n` +
                      `👑 Dueño: <@${message.guild.ownerId}>`);
    }
};
