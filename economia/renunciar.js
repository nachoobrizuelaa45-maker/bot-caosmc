const { EmbedBuilder } = require('discord.js');
const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });

module.exports = {
    name: 'renunciar',
    async execute(message) {
        const userId = message.author.id;
        
        // Obtenemos el trabajo actual antes de borrarlo
        const trabajoActual = db.get(userId, "trabajoActual") || 'Desempleado';

        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés ningún empleo al cual renunciar.');
        }

        // Renunciamos: cambiamos el trabajo actual a 'Desempleado'
        db.set(userId, 'Desempleado', "trabajoActual");

        // --- EMBED ESTILO CAPTURA ---
        const embedRenuncia = new EmbedBuilder()
            .setColor(0xFF0000) // Rojo para la renuncia
            .setAuthor({ name: `🛑📝 Renunciar ${message.author.username}`, iconURL: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' })
            .setDescription(`🛑\n${message.member} has renunciado a tu empleo , ya no trabajas de **${trabajoActual}**.`)
            .setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embedRenuncia] });
    }
};
