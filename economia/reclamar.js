const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

// Mapa para manejar el cooldown rápido
const cooldowns = new Map();

module.exports = {
    name: 'reclamar', // Comando: $reclamar
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 5 * 1000; // 5 segundos

        // 1. Verificación de Cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (ahora < expirationTime) {
                const timeLeft = ((expirationTime - ahora) / 1000).toFixed(1);
                return message.reply(`ℹ️ Esperá **${timeLeft}s** para tu próxima recompensa.`);
            }
        }

        // 2. Calcular recompensa (5k a 15k)
        const recompensa = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        // 3. Aplicar al usuario
        db.math(userId, "add", recompensa, "dinero");
        cooldowns.set(userId, ahora);

        // 4. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({ name: `💰 Recompensa de economía`, iconURL: message.guild.iconURL() })
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`ℹ️ **Felicidades <@${userId}>, has reclamado tu recompensa diaria de ${recompensa.toLocaleString()}$!**`)
            .setFooter({ text: `${message.author.username} | ${new Date().toLocaleDateString()}` });
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
