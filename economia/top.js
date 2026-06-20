const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../db'); 
// Borramos o comentamos la línea de verificarCanal si no la vamos a usar aquí
// const { esCanalValido } = require('./verificarCanal'); 

module.exports = {
    name: 'top',
    async execute(message) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        // --- ESTA ES LA LÍNEA QUE BORRAMOS PARA QUE FUNCIONE EN TODOS LOS CANALES ---
        // if (!esCanalValido(message)) return;

        // Función para obtener el top 10
        const getTopData = () => {
            return db.keyArray().map(key => ({
                id: key,
                dinero: db.get(key, "dinero") || 0
            })).sort((a, b) => b.dinero - a.dinero).slice(0, 10);
        };

        const generarEmbed = () => {
            const top = getTopData();
            let desc = "";
            const emojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
            
            top.forEach((d, i) => {
                desc += `${emojis[i] || (i+1) + "️⃣"} | <@${d.id}>: **${d.dinero.toLocaleString()}$**\n`;
            });
            
            return new EmbedBuilder()
                .setTitle('🏦 Top Economía')
                .setColor(0xF1C40F)
                .setDescription(desc || "Todavía no hay datos.")
                .setFooter({ text: '💸· Mejor economía de CAOSMC', iconURL: message.guild.iconURL() });
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('refresh_top')
                .setLabel('Actualizar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔄')
        );

        const msg = await message.channel.send({ embeds: [generarEmbed()], components: [row] });

        // Colector que escucha el botón
        const collector = msg.createMessageComponentCollector({ time: 600000 });

        collector.on('collect', async i => {
            if (i.customId === 'refresh_top') {
                await i.update({ embeds: [generarEmbed()] });
            }
        });
    }
};
    
