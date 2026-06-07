const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'reclamar',
    async execute(message) {
        // Borramos el comando al toque
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const seisDiasEnMs = 6 * 24 * 60 * 60 * 1000; // 6 días en milisegundos

        // Nos aseguramos de tener el registro del usuario
        db.ensure(userId, { dinero: 0, ultimoReclamo: 0 });

        // 1. Verificación del último reclamo
        const ultimoReclamo = db.get(userId, "ultimoReclamo");
        const tiempoPasado = ahora - ultimoReclamo;

        if (ultimoReclamo !== 0 && tiempoPasado < seisDiasEnMs) {
            const tiempoRestante = seisDiasEnMs - tiempoPasado;
            const dias = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
            const horas = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            
            return message.reply(`⏰ Tenés que esperar **${dias} días y ${horas} horas** para volver a reclamar.`).then(msg => setTimeout(() => msg.delete(), 7000));
        }

        // 2. Calcular recompensa
        const recompensa = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        // 3. Guardar el nuevo tiempo y sumar el dinero
        db.set(userId, ahora, "ultimoReclamo");
        db.math(userId, "add", recompensa, "dinero");

        // 4. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({ name: `💰 Recompensa de economía`, iconURL: message.guild.iconURL() })
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`ℹ️ **Felicidades <@${userId}>, has reclamado tu recompensa. Ganaste ${recompensa.toLocaleString()}$!**\n\nVolvé a reclamar en 6 días.`)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() });
        
        message.channel.send({ embeds: [embed] });
    }
};

