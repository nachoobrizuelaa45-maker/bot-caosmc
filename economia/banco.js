const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banco',
    async execute(message) {
        const userId = message.author.id;
        
        // Corregido: Claves en singular para coincidir con cauto.js, ccasa.js, etc.
        const d = db.ensure(userId, { 
            dinero: 0, 
            banco: 0, 
            trabajos: 0, 
            armas: 0, 
            auto: 0, 
            casa: 0, 
            negocio: 0, 
            empresa: 0 
        });

        const embed = new EmbedBuilder()
            .setColor(0xE91E63)
            .setAuthor({ name: `🏦 Banco de ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(
                `💰 **•CAPITAL FINANCIERO**\n💵 Dinero: ${d.dinero}$\n🏦 Banco: ${d.banco}$\n🥚 Trabajos: ${d.trabajos}\n🔫 Armas: ${d.armas}\n\n` +
                `🏘️ **•PROPIEDADES**\n🚗 Autos: ${d.auto}\n🏠 Casas: ${d.casa}\n🏢 Negocios: ${d.negocio}\n🏭 Empresas: ${d.empresa}\n\n` +
                `📄 **•RESUMEN**\n👤 banco ${message.author.username}\nvalorada en ${d.dinero + d.banco + (d.trabajos*50)}$`
            );
        message.channel.send({ embeds: [embed] });
    }
};
            
