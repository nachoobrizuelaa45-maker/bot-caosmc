const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'reclamar',
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        // 6 días en milisegundos: 6 días * 24 horas * 60 minutos * 60 segundos * 1000
        const seisDias = 6 * 24 * 60 * 60 * 1000; 

        // 1. Obtener la última vez que reclamó (aseguramos que exista en la DB)
        db.ensure(userId, { dinero: 0, ultimaReclamacion: 0 });
        const ultimaReclamacion = db.get(userId, "ultimaReclamacion");

        // 2. Verificación de Cooldown de 6 días
        if (ahora - ultimaReclamacion < seisDias) {
            const tiempoRestante = seisDias - (ahora - ultimaReclamacion);
            const dias = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
            const horas = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            
            return message.reply(`⏰ Ya reclamaste tu recompensa. Volvé en **${dias} días y ${horas} horas**.`);
        }

        // 3. Calcular recompensa
        const recompensa = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        // 4. Aplicar recompensa y actualizar fecha en la DB
        db.math(userId, "add", recompensa, "dinero");
        db.set(userId, ahora, "ultimaReclamacion");

        // 5. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({ name: `💰 Recompensa de economía`, iconURL: message.guild.iconURL() })
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`ℹ️ **Felicidades <@${userId}>, has reclamado tu recompensa de ${recompensa.toLocaleString()}$!**`)
            .setFooter({ text: `${message.author.username} | ${new Date().toLocaleDateString()}` });
        
        message.channel.send({ embeds: [embed] });
        
        // 6. Borrar el mensaje del comando
        message.delete().catch(() => {});
    }
};
