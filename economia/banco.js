const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js

module.exports = {
    name: 'banco',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        const userId = message.author.id;
        
        // Nos aseguramos de tener la estructura completa en la DB central
        db.ensure(userId, { 
            dinero: 0, 
            banco: 0, 
            trabajos: 0, 
            armas: 0, 
            autos: 0, 
            casas: 0, 
            negocios: 0, 
            empresas: 0 
        });

        // Obtenemos los datos actuales
        const d = db.get(userId);
        const valorTotal = (d.dinero + d.banco + (d.trabajos * 50));

        const embed = new EmbedBuilder()
            .setColor(0xE91E63)
            .setAuthor({ 
                name: `🏦 Banco de ${message.author.username}`, 
                iconURL: message.author.displayAvatarURL() 
            })
            .setDescription(
                `💰 **• CAPITAL FINANCIERO**\n` +
                `💵 Dinero: **${d.dinero.toLocaleString()}$**\n` +
                `🏦 Banco: **${d.banco.toLocaleString()}$**\n` +
                `🥚 Trabajos: **${d.trabajos}**\n` +
                `🔫 Armas: **${d.armas}**\n\n` +
                `🏘️ **• PROPIEDADES**\n` +
                `🚗 Autos: **${d.autos}**\n` +
                `🏠 Casas: **${d.casas}**\n` +
                `🏢 Negocios: **${d.negocios}**\n` +
                `🏭 Empresas: **${d.empresas}**\n\n` +
                `📄 **• RESUMEN**\n` +
                `👤 Cuenta: **${message.author.username}**\n` +
                `📈 Valorada en: **${valorTotal.toLocaleString()}$**`
            )
            .setTimestamp();
        
        message.channel.send({ embeds: [embed] });
    }
};

