const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'retirar',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const input = args[0];

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { dinero: 0, banco: 0 });
        const bancoActual = db.get(userId, "banco");

        // 1. Opción "all"
        if (input === 'all') {
            if (bancoActual < 1) {
                return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• No tienes nada para retirar del banco.')] })
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            }
            
            db.math(userId, "add", bancoActual, "dinero");
            db.math(userId, "sub", bancoActual, "banco");

            return message.reply({ embeds: [new EmbedBuilder().setColor(0x1DD882).setDescription(`📥• <@${userId}> Retiraste todo de tu banco exitosamente.`)] })
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Opción numérica
        const monto = parseInt(input);
        if (!monto || isNaN(monto) || monto <= 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• Menciona un número válido.')] })
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        if (bancoActual < monto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• No tienes esa cantidad de dinero para retirar.')] })
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // Realizamos la operación en la DB central
        db.math(userId, "sub", monto, "banco");
        db.math(userId, "add", monto, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x1DD882)
            .setAuthor({ name: `📥 Retiro Bancario ${message.member.displayName}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<@${userId}> ha retirado **${monto.toLocaleString()}$** del banco 🏦`);

        message.channel.send({ embeds: [embed] });
    }
};

