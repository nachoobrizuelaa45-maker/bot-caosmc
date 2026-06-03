const { EmbedBuilder } = require('discord.js');

// Mapa para guardar los tiempos: { userId: fechaTimestamp }
const cooldowns = new Map();

module.exports = {
    name: 'apodo',
    execute(message, args) {
        const userId = message.author.id;
        const nuevoNombre = args.join(' ');
        
        // Verificamos si escribió un nombre
        if (!nuevoNombre) {
            return message.reply('⚠️ Usá: `$apodo [nombre]`').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // Cálculo de 6 días en milisegundos (6 días * 24h * 60m * 60s * 1000ms)
        const cooldownTime = 6 * 24 * 60 * 60 * 1000;
        const lastChange = cooldowns.get(userId) || 0;
        const now = Date.now();

        // Verificamos si está en cooldown
        if (now - lastChange < cooldownTime) {
            const timeElapsed = now - lastChange;
            const timeLeftMs = cooldownTime - timeElapsed;
            // Convertimos a horas para mostrar cuánto le falta
            const hoursLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60));
            
            return message.reply(`🕛•**»** Debes esperar **${hoursLeft}** horas para volver a cambiar tu nombre.`)
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                    message.delete().catch(() => {}); // Borra el comando original aunque falle el cooldown
                });
        }

        // Intentamos cambiar el apodo
        message.member.setNickname(nuevoNombre).then(() => {
            cooldowns.set(userId, now); // Guardamos la fecha actual

            const embed = new EmbedBuilder()
                .setTitle('🪅•Nuevo Nombre')
                .setThumbnail(message.author.displayAvatarURL())
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setColor(0x00FF00) // Un color verdecito para confirmar
                .setDescription(`<@${userId}> se ha cambiado el nombre a 👤» **${nuevoNombre}**`)
                .setFooter({ text: 'Utiliza $apodo y cambia tu Apodo.!👤', iconURL: message.author.displayAvatarURL() });

            // Enviamos el embed y lo borramos a los 5 segundos
            message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
            
            // Borramos el comando original que envió el usuario
            message.delete().catch(() => {});
        }).catch((err) => {
            console.error(err);
            message.reply('❌ No pude cambiar tu apodo. (¿Tengo permiso para administrar apodos?)');
        });
    }
};
