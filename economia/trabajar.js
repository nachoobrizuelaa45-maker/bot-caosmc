const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { trabajos } = require('../data.js'); 
const { esCanalValido } = require('./verificarCanal');

// Objeto para manejar el tiempo de espera por usuario
const cooldowns = new Map();

module.exports = {
    name: 'trabajar',
    async execute(message) {
        message.delete().catch(() => {});
        if (!esCanalValido(message)) return;

        const userId = message.author.id;

        // 1. Lógica de Cooldown (5 segundos)
        const ahora = Date.now();
        const tiempoEspera = 5000; // 5 segundos
        if (cooldowns.has(userId)) {
            const tiempoRestante = cooldowns.get(userId) + tiempoEspera - ahora;
            if (tiempoRestante > 0) {
                return message.reply(`⏳• Debes esperar **${Math.ceil(tiempoRestante / 1000)}** segundos para volver a trabajar.`)
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            }
        }
        cooldowns.set(userId, ahora);

        // 2. Base de datos
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

        // 3. Embed estilo "Trabajando" igual a la imagen
        const embed = new EmbedBuilder()
            .setAuthor({ name: '👷 Trabajando', iconURL: 'https://cdn-icons-png.flaticon.com/512/2910/2910165.png' })
            .setColor(0xFF8C00) // Color naranja del borde de la imagen
            .setDescription(`**<@${userId}>**\nTrabajas como **${trabajoActual}** y recibes **${ganancia}$**.`);

        message.channel.send({ embeds: [embed] });
    }
};
                              
