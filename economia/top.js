const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'top',
    async execute(message) {
        if (!esCanalValido(message)) return;

        // Función para obtener el top 10 real de la base de datos
        const getTopData = () => {
            // Ordenamos los usuarios por dinero (banco) de mayor a menor
            return db.array().sort((a, b) => (b.banco || 0) - (a.banco || 0)).slice(0, 10);
        };

        const generarEmbed = () => {
            const top = getTopData();
            let desc = "";
            const emojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
            
            top.forEach((d, i) => {
                desc += `${emojis[i] || i+1 + "️⃣"} | **User:** <@${d.id}>\n`;
            });
            
            return new EmbedBuilder()
                .setTitle('🏦 Economía Discord')
                .setColor(0xF1C40F)
                .setDescription(desc + "\n👷• **¿Qué esperás para ser el mejor del top?**")
                .setFooter({ text: '💸· Mejor economía de CAOMC CRAFT', iconURL: message.guild.iconURL() });
        };

        // Botón de actualización
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('refresh_top')
                .setLabel('ECONOMÍA')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('💰')
        );

        const msg = await message.channel.send({ embeds: [generarEmbed()], components: [row] });
        message.delete().catch(() => {});

        // Colector que escucha el botón
        const collector = msg.createMessageComponentCollector({ time: 600000 }); // Dura 10 min

        collector.on('collect', async i => {
            if (i.customId === 'refresh_top') {
                await i.update({ embeds: [generarEmbed()] });
            }
        });
    }
};
