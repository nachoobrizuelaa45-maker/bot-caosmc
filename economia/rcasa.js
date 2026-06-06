const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

const cooldowns = new Map();

module.exports = {
    name: 'rcasa',
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 300 * 1000; // 5 minutos

        // 1. Verificación de Cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (ahora < expirationTime) {
                const timeLeft = ((expirationTime - ahora) / 1000).toFixed(0);
                return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar tus casas.`);
            }
        }

        // 2. Obtener datos
        const d = db.ensure(userId, { casa: 0, dinero: 0 });

        // 3. Verificar si tiene al menos una casa
        if (d.casa < 1) {
            return message.reply('🏡🛑 No tenés ninguna casa para rentar.');
        }

        // 4. Calcular ganancia (entre 1000 y 2500)
        const ganancia = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;

        // 5. Aplicar ganancia
        db.math(userId, "add", ganancia, "dinero");
        cooldowns.set(userId, ahora);

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setAuthor({ name: `🏡 Renta de Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏡 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus casas durante 5 minutos.`);
        
        message.channel.send({ embeds: [embed] });
        
        message.delete().catch(() => {});
    }
};
