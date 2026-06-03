const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'staff',
    execute(message, args) {
        // --- SEGURIDAD: Solo Staff ---
        // Podés agregar acá los IDs de los roles que pueden ver esto
        const embed = new EmbedBuilder()
            .setTitle('🛡️ Panel de Comandos - STAFF CAOSMC')
            .setColor(0xFFFF00)
            .setDescription('¡Hola Staff! Acá tenés los comandos para moderar el servidor. Úsalos con responsabilidad.')
            .addFields(
                { name: '🔨 Moderación', value: 
                    '`$ban [usuario] [razón]` - Banea a un usuario.\n' +
                    '`$kick [usuario] [razón]` - Expulsa a un usuario.\n' +
                    '`$unban [id]` - Desbanea a un usuario.\n' +
                    '`$mute [usuario]` - Mutea a un usuario.\n' +
                    '`$unmute [usuario]` - Desmutea a un usuario.' 
                },
                { name: '⚠️ Gestión de Faltas', value: 
                    '`$daradv [usuario]` - Registra una advertencia.\n' +
                    '`$quitarfalta [usuario]` - Elimina una falta del historial.' 
                },
                { name: '💡 Cómo usar correctamente:', value: 
                    '1. Siempre tené una prueba (captura o video) antes de usar `$ban` o `$kick`.\n' +
                    '2. Usá `$mute` antes del ban si la infracción es menor.\n' +
                    '3. Mantené el canal de logs siempre activo para que quede registro.' 
                }
            )
            .setFooter({ text: 'CAOSMC - Uso exclusivo de Staff' });

        // Intentamos enviar al MD
        message.author.send({ embeds: [embed] }).then(() => {
            message.reply('📩 ¡Panel de Staff enviado a tus MD!').then(msg => setTimeout(() => msg.delete(), 5000));
        }).catch(() => {
            message.reply('❌ No pude enviarte el MD. ¡Abrí tus mensajes privados!').then(msg => setTimeout(() => msg.delete(), 5000));
        });

        // Borramos el comando $staff ejecutado
        message.delete().catch(() => {});
    }
};
