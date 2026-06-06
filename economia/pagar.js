const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'pagar',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const monto = parseInt(args[1]);

        // Validaciones básicas con borrado automático de error
        if (!target) return message.reply('📬• Menciona a un usuario válido.')
            .then(msg => setTimeout(() => msg.delete(), 5000));
        if (target.id === userId) return message.reply('⛔️ No puedes transferirte a ti mismo.')
            .then(msg => setTimeout(() => msg.delete(), 5000));
        if (!monto || isNaN(monto) || monto <= 0) return message.reply('📬• Proporciona una cantidad válida.')
            .then(msg => setTimeout(() => msg.delete(), 5000));

        // 1. Verificación de saldo en el banco usando la DB central
        db.ensure(userId, { banco: 0 });
        db.ensure(target.id, { banco: 0 });
        const saldoEmisor = db.get(userId, "banco");

        if (saldoEmisor < monto) {
            return message.reply('📬• No tienes esa cantidad en el banco para transferir.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizamos la transferencia en la DB central
        db.math(userId, "sub", monto, "banco");
        db.math(target.id, "add", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0x1DD882) 
            .setAuthor({ name: `📬 Transferencia Bancaria ${message.member.displayName}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🏦📬 <@${userId}> le hizo una transferencia de **${monto.toLocaleString()}$** a <@${target.id}>`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};

