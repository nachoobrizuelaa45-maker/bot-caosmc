const { EmbedBuilder } = require('discord.js'); // Asegurate de importar EmbedBuilder
const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { trabajos } = require('../data.js'); 

module.exports = {
    name: 'trabajar',
    async execute(message) {
        const userId = message.author.id;
        
        db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });
        const trabajoActual = db.get(userId, "trabajoActual");

        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés un trabajo firmado. Usá `$trabajos firmar [nombre]` primero.');
        }

        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === trabajoActual.toLowerCase());
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const pagoBase = nivel * 150;
        const bonus = Math.floor(Math.random() * 200);
        const ganancia = pagoBase + bonus;

        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        const totalTrabajos = db.get(userId, "trabajos");
        
        // --- AQUÍ HACEMOS EL EMBED PERSONALIZADO ---
        const embedTrabajo = new EmbedBuilder()
            .setColor(0xF1C40F) // Color naranja/amarillo como en la captura
            .setAuthor({ name: 'Trabajando', iconURL: 'https://cdn-icons-png.flaticon.com/512/2921/2921761.png' })
            .setDescription(`**${message.member}**\nTrabajás como **${trabajoActual}** y recibís **${ganancia}$**.\nTotal de trabajos: **${totalTrabajos}**`)
            .setThumbnail(message.author.displayAvatarURL()); // Pone tu foto al costado como en la captura

        message.reply({ embeds: [embedTrabajo] });
    }
};
            
