const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Ahora usa tu archivo db.js central[span_1](start_span)[span_1](end_span)

module.exports = {
    name: 'renunciar',
    async execute(message) {
        // Borramos el comando original apenas se ejecuta
        message.delete().catch(() => {});

        const userId = message.author.id;
        
        // 1. Obtenemos el trabajo actual desde el archivo db.js centralizado
        const trabajoActual = db.get(userId, "trabajoActual") || 'Desempleado';

        // 2. Validación: si no trabaja, avisamos
        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés ningún empleo al cual renunciar.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Renunciamos: cambiamos el trabajo actual a 'Desempleado'
        db.set(userId, 'Desempleado', "trabajoActual");

        // 4. EMBED de renuncia
        const embedRenuncia = new EmbedBuilder()
            .setColor(0xFF0000)
            .setAuthor({ name: `🛑 Renuncia Confirmada`, iconURL: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' })
            .setDescription(`🛑 <@${userId}> has renunciado a tu empleo. Ya no trabajas de **${trabajoActual}**.`)
            .setThumbnail(message.author.displayAvatarURL());

        message.channel.send({ embeds: [embedRenuncia] });
    }
};

