const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { trabajos } = require('../data.js'); 
const { esCanalValido } = require('./verificarCanal');

const cooldowns = new Map();

module.exports = {
    name: 'trabajar',
    async execute(message) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const user = message.author;

        // 1. Cooldown de 5 segundos
        const ahora = Date.now();
        const tiempoEspera = 5000;
        if (cooldowns.has(userId)) {
            const tiempoRestante = cooldowns.get(userId) + tiempoEspera - ahora;
            if (tiempoRestante > 0) {
                // CORREGIDO: usamos channel.send para evitar error de referencia
                return message.channel.send(`⏳• <@${userId}>, debés esperar **${Math.ceil(tiempoRestante / 1000)}** segundos.`)
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            }
        }
        cooldowns.set(userId, ahora);

        // 2. Lógica de trabajo
        db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });
        const trabajoActual = db.get(userId, "trabajoActual");

        if (trabajoActual === 'Desempleado') {
            // CORREGIDO: usamos channel.send
            return message.channel.send(`❌ <@${userId}>, no tenés un trabajo firmado.`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === trabajoActual.toLowerCase());
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const ganancia = (nivel * 150) + Math.floor(Math.random() * 200);

        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        // 3. Embed con diseño visual
        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: '👷 Trabajando', 
                iconURL: user.displayAvatarURL() 
            })
            .setDescription(`**@${user.username}**\nTrabajas como **${trabajoActual}** y recibes **${ganancia}$**.`)
            .setThumbnail(user.displayAvatarURL()) 
            .setColor(0xFF8C00); 

        message.channel.send({ embeds: [embed] });
    }
};
            
