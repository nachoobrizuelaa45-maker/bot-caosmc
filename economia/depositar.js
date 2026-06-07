const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'depositar',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const cantidadInput = args[0];

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { dinero: 0, banco: 0 });
        const efectivoActual = db.get(userId, "dinero");

        // 1. Lógica de "all"
        if (cantidadInput === 'all') {
            if (efectivoActual < 1) {
                return message.reply('⛔️ No tenés dinero para depositar.')
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            }
            
            db.math(userId, "add", efectivoActual, "banco");
            db.math(userId, "sub", efectivoActual, "dinero");
            
            return message.reply(`🏦📥 <@${userId}> depositaste **${efectivoActual.toLocaleString()}$** en el banco.`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Lógica de cantidad numérica
        const monto = parseInt(cantidadInput);
        if (!monto || isNaN(monto) || monto <= 0) {
            return message.reply('⛔️ Ingresá una cantidad válida.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }
        
        if (efectivoActual < monto) {
            return message.reply('⛔️ No tenés esa cantidad en efectivo.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Realizamos el depósito en la DB central
        db.math(userId, "add", monto, "banco");
        db.math(userId, "sub", monto, "dinero");

        const embed = new EmbedBuilder()
            .setTitle(`📤 Depósito Bancario`)
            .setDescription(`🏦📥 <@${userId}> has depositado **${monto.toLocaleString()}$** en el banco.`)
            .setColor(0x00FF00);
        
        message.channel.send({ embeds: [embed] });
    }
};

