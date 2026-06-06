const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal'); // Importamos la verificación

module.exports = {
    name: 'retirar',
    async execute(message, args) {
        // 1. Verificación de canal
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { dinero: 0, banco: 0 });
        const input = args[0];

        // 2. Opción "all"
        if (input === 'all') {
            if (d.banco < 1) {
                return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• No tienes nada para retirar del banco.')] });
            }
            
            const total = d.banco;
            db.math(userId, "add", total, "dinero");
            db.math(userId, "sub", total, "banco");

            return message.reply({ embeds: [new EmbedBuilder().setColor(0x1DD882).setDescription(`📥• <@${userId}> Retiraste todo de tu banco exitosamente.`)] });
        }

        // 3. Opción numérica
        const monto = parseInt(input);
        if (!monto || isNaN(monto) || monto <= 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• Menciona un número válido.')] });
        }

        if (d.banco < monto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(0xC13849).setDescription('📥• No tienes esa cantidad de dinero para retirar.')] });
        }

        // Realizamos la operación
        db.math(userId, "sub", monto, "banco");
        db.math(userId, "add", monto, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x1DD882)
            .setAuthor({ name: `📥 Retiro Bancario ${message.member.displayName}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<@${userId}> ha retirado **${monto.toLocaleString()}$** del banco 🏦`);

        message.channel.send({ embeds: [embed] });
    }
};
