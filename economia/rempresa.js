const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

// Mapa para manejar el cooldown de las empresas
const cooldowns = new Map();

module.exports = {
    name: 'rempresa', // Comando: $rempresa
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 480 * 1000; // 8 minutos en milisegundos

        // 1. Verificación de Cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (ahora < expirationTime) {
                const timeLeft = ((expirationTime - ahora) / 1000).toFixed(0);
                return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar tus empresas.`);
            }
        }

        // 2. Obtener datos
        const d = db.ensure(userId, { empresa: 0, dinero: 0 });

        // 3. Verificar si tiene al menos una empresa
        if (d.empresa < 1) {
            return message.reply('🏢🛑 No tenés ninguna empresa para rentar.');
        }

        // 4. Calcular ganancia aleatoria entre 10k y 20k
        const ganancia = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;

        // 5. Aplicar ganancia
        db.math(userId, "add", ganancia, "dinero");
        cooldowns.set(userId, ahora);

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({ name: `🏢 Renta de Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏢 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus empresas.`);
        
        message.channel.send({ embeds: [embed] });
        
        message.delete().catch(() => {});
    }
};
