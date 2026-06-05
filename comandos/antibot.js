const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'antibot',
    execute(message, args) {
        // Borramos el comando ejecutado
        message.delete().catch(() => {});

        // Roles autorizados (los mismos que el antilinks)
        const rolesPermitidos = ['1506013227686039562', '1509746102415392808'];

        // Verificación de seguridad
        if (!message.member.roles.cache.some(r => rolesPermitidos.includes(r.id))) {
            return message.channel.send("⛔ **Error:** No tenés permisos para configurar el Anti-Bot.")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const estado = args[0]; // true o false

        if (!estado || (estado !== 'true' && estado !== 'false')) {
            return message.channel.send("⚠️ Uso: `$antibot true` o `$antibot false`")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Guardamos el estado global
        global.antiBotActivado = (estado === 'true');

        const embed = new EmbedBuilder()
            .setColor(global.antiBotActivado ? 0x00FF00 : 0xFF0000)
            .setTitle(global.antiBotActivado ? "✅ Anti-Bot Activado" : "❌ Anti-Bot Desactivado")
            .setDescription(`El sistema de protección Anti-Bot ahora está: **${global.antiBotActivado ? 'ENCENDIDO' : 'APAGADO'}**`);

        message.channel.send({ embeds: [embed] });
    }
};
