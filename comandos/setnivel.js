const fs = require('fs');

module.exports = {
    name: 'setnivel',
    execute(message, args) {
        // IDs de los roles permitidos
        const rolesPermitidos = ['1506013227686039562', '1509746102415392808', '1503125667792027658'];

        // Verificamos si el usuario tiene alguno de los roles permitidos o es Administrador
        const tienePermiso = message.member.permissions.has('Administrator') || 
                             message.member.roles.cache.some(r => rolesPermitidos.includes(r.id));

        if (!tienePermiso) return message.reply('🚫 No tenés permiso para usar este comando.');

        const target = message.mentions.members.first();
        const nivel = parseInt(args[1]);

        if (!target || !nivel) return message.reply('⚠️ Uso: `$setnivel @usuario 50`');

        let niveles = JSON.parse(fs.readFileSync('./niveles.json', 'utf8'));
        
        niveles[target.id] = { xp: 0, nivel: nivel };
        fs.writeFileSync('./niveles.json', JSON.stringify(niveles, null, 2));

        global.actualizarRoles(target, nivel);

        message.reply(`✅ **${target.displayName}** ahora es nivel **${nivel}**. ¡Roles actualizados!`);
        message.delete().catch(() => {});
    }
};
