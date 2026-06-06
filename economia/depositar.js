const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal'); // Importamos tu verificador

module.exports = {
    name: 'depositar',
    async execute(message, args) {
        // 1. Verificación de canal (lo que ya tenés en verificarCanal.js)
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const datos = db.ensure(userId, { dinero: 0, banco: 0 });
        const cantidadInput = args[0];

        // 2. Lógica de "all"
        if (cantidadInput === 'all') {
            if (datos.dinero < 1) return message.reply('⛔️ No tenés dinero para depositar.');
            
            const monto = datos.dinero;
            db.math(userId, "add", monto, "banco");
            db.math(userId, "sub", monto, "dinero");
            
            return message.reply(`🏦📥 <@${userId}> depositaste **${monto.toLocaleString()}$** en el banco.`);
        }

        // 3. Lógica de cantidad numérica
        const monto = parseInt(cantidadInput);
        if (!monto || isNaN(monto) || monto <= 0) return message.reply('⛔️ Ingresá una cantidad válida.');
        if (datos.dinero < monto) return message.reply('⛔️ No tenés esa cantidad en efectivo.');

        db.math(userId, "add", monto, "banco");
        db.math(userId, "sub", monto, "dinero");

        const embed = new EmbedBuilder()
            .setTitle(`📤 Depósito Bancario`)
            .setDescription(`🏦📥 <@${userId}> has depositado **${monto.toLocaleString()}$** en el banco.`)
            .setColor(0x00FF00);
        
        message.channel.send({ embeds: [embed] });
    }
};
