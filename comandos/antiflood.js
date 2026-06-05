const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'antiflood',
    execute(message, args) {
        // Borramos el comando ejecutado para mantener el chat limpio
        message.delete().catch(() => {});

        // Roles autorizados (los mismos que venís usando)
        const rolesPermitidos = ['1506013227686039562', '1509746102415392808'];

        // Verificación de permisos
        if (!message.member.roles.cache.some(r => rolesPermitidos.includes(r.id))) {
            return message.channel.send("⛔ **Error:** No tenés permisos para configurar el Anti-Flood.")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const estado = args[0]; // true o false

        if (!estado || (estado !== 'true' && estado !== 'false')) {
            return message.channel.send("⚠️ Uso: `$antiflood true` o `$antiflood false`")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Guardamos el estado global para que el evento lo lea
        global.antiFloodActivado = (estado === 'true');

        const embed = new EmbedBuilder()
            .setColor(global.antiFloodActivado ? 0x00FF00 : 0xFF0000)
            .setTitle(global.antiFloodActivado ? "✅ Anti-Flood Activado" : "❌ Anti-Flood Desactivado")
            .setDescription(`El sistema de protección Anti-Flood ahora está: **${global.antiFloodActivado ? 'ENCENDIDO' : 'APAGADO'}**`)
            .setFooter({ text: `Configurado por: ${message.author.username}` });

        message.channel.send({ embeds: [embed] });
    }
};
