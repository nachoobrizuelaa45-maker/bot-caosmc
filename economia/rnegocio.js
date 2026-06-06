const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

// Mapa para manejar el cooldown
const cooldowns = new Map();

module.exports = {
    name: 'rnegocio', // Comando: $rnegocio
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 360 * 1000; // 6 minutos en milisegundos

        // 1. Verificación de Cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (ahora < expirationTime) {
                const timeLeft = ((expirationTime - ahora) / 1000).toFixed(0);
                return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar.`);
            }
        }

        // 2. Obtener datos
        const d = db.ensure(userId, { negocio: 0, dinero: 0 });

        // 3. Verificar si tiene al menos un negocio
        if (d.negocio < 1) {
            return message.reply('🏬🛑 No tenés ningún negocio para rentar.');
        }

        // 4. Calcular ganancia
        const ganancia = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;

        // 5. Aplicar ganancia
        db.math(userId, "add", ganancia, "dinero");
        cooldowns.set(userId, ahora);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Renta de Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏬 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus negocios.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza (Opcional, podés borrar o dejar el mensaje)
        message.delete().catch(() => {});
    }
};
