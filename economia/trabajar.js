const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { trabajos } = require('../data.js'); 
const { esCanalValido } = require('./verificarCanal');

const cooldowns = new Map();

module.exports = {
    name: 'trabajar',
    async execute(message) {
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
                return message.reply(`⏳• Debes esperar **${Math.ceil(tiempoRestante / 1000)}** segundos.`).then(msg => setTimeout(() => msg.delete(), 5000));
            }
        }
        cooldowns.set(userId, ahora);

        // 2. Lógica de trabajo
        db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });
        const trabajoActual = db.get(userId, "trabajoActual");

        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés un trabajo firmado.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === trabajoActual.toLowerCase());
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const ganancia = (nivel * 150) + Math.floor(Math.random() * 200);

        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        // 3. Embed con diseño visual (Perfil a la izquierda y derecha)
        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: '👷 Trabajando', 
                iconURL: user.displayAvatarURL() // Foto de perfil a la izquierda
            })
            .setDescription(`**@${user.username}**\nTrabajas como **${trabajoActual}** y recibes **${ganancia}$**.`)
            .setThumbnail(user.displayAvatarURL()) // Foto de perfil a la derecha (redonda)
            .setColor(0xFF8C00); // Color del borde lateral

        message.channel.send({ embeds: [embed] });
    }
};
