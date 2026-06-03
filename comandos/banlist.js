module.exports = {
    name: 'banlist',
    execute(message, args) {
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];
        if (!message.member.roles.cache.some(r => allowedRoles.includes(r.id))) return message.reply('🚫 No tenés permiso.');

        message.guild.bans.fetch().then(bans => {
            if (bans.size === 0) return message.reply('✅ No hay nadie baneado actualmente.');
            
            const list = bans.map(ban => ban.user.tag).join('\n');
            message.reply(`📜 **Lista de baneados:**\n\`\`\`${list}\`\`\``);
        });
    }
};
