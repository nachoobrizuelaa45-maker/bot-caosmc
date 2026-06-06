const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal'); // Importamos tu verificador

module.exports = {
    name: 'pagar',
    async execute(message, args) {
        // 1. Verificación de canal
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const monto = parseInt(args[1]);

        // Validaciones básicas
        if (!target) return message.reply('📬• Menciona a un usuario válido.');
        if (target.id === userId) return message.reply('⛔️ No puedes transferirte a ti mismo.');
        if (!monto || isNaN(monto) || monto <= 0) return message.reply('📬• Proporciona una cantidad válida.');

        // 2. Verificación de saldo en el banco
        const emisor = db.ensure(userId, { banco: 0 });
        const receptor = db.ensure(target.id, { banco: 0 });

        if (emisor.banco < monto) {
            return message.reply('📬• No tienes esa cantidad en el banco para transferir.');
        }

        // 3. Realizamos la transferencia
        db.math(userId, "sub", monto, "banco");
        db.math(target.id, "add", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0x1DD882) // Verde éxito
            .setAuthor({ name: `📬 Transferencia Bancaria ${message.member.displayName}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🏦📬 <@${userId}> le hizo una transferencia de **${monto.toLocaleString()}$** a <@${target.id}>`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
