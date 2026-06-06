const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'cauto', // Comando: $cauto
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { auto: 0, dinero: 0 });
        const PRECIO_AUTO = 100000;

        // 1. Validación de saldo
        if (d.dinero < PRECIO_AUTO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un auto (Cuesta 100.000$).');
        }

        // 2. Realizar compra
        db.math(userId, "add", 1, "auto");
        db.math(userId, "sub", PRECIO_AUTO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🚗 Comprar Vehículo`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🚗 <@${userId}> compraste un vehículo por **${PRECIO_AUTO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
