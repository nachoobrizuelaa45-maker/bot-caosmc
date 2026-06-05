const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'antilinks',
    execute(message, args) {
        // Borramos el mensaje del comando ejecutado apenas se lanza
        message.delete().catch(() => {});

        // Roles que tienen permiso exclusivo para usar este comando
        const rolesPermitidos = ['1506013227686039562', '1509746102415392808'];

        // Verificación: si el usuario no tiene los roles, no hace nada
        if (!message.member.roles.cache.some(r => rolesPermitidos.includes(r.id))) {
            return message.channel.send("⛔ **Error:** No tenés permisos para configurar el Antilinks.")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const estado = args[0]; // Argumento: true o false

        // Verificación: si no pusieron true o false, les avisamos
        if (!estado || (estado !== 'true' && estado !== 'false')) {
            return message.channel.send("⚠️ Uso: `$antilinks true` o `$antilinks false`")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Guardamos el estado en una variable global para que el evento antilinks.js la vea
        global.antiLinksActivado = (estado === 'true');

        // Creamos el mensaje de confirmación
        const embed = new EmbedBuilder()
            .setColor(global.antiLinksActivado ? 0x00FF00 : 0xFF0000)
            .setTitle(global.antiLinksActivado ? "✅ Antilinks Activado" : "❌ Antilinks Desactivado")
            .setDescription(`El sistema de protección ahora está: **${global.antiLinksActivado ? 'ENCENDIDO' : 'APAGADO'}**`)
            .setFooter({ text: `Configurado por: ${message.author.username}` });

        // Enviamos el aviso
        message.channel.send({ embeds: [embed] });
    }
};

