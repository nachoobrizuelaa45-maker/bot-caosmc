module.exports = {
    name: 'dmall',
    execute(message, args) {
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];
        if (!message.member.roles.cache.some(r => allowedRoles.includes(r.id))) return message.reply('🚫 No tenés permiso.');

        const msg = args.join(' ');
        if (!msg) return message.reply('⚠️ Escribí el mensaje que querés enviar.');

        message.guild.members.cache.forEach(member => {
            if (member.user.bot) return; // No le mandamos a otros bots
            member.send(msg).catch(err => console.log(`No pude enviarle a ${member.user.tag}`));
        });

        message.reply('✅ Mensaje enviado a todos los miembros.');
    }
};
