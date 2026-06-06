const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.id !== '1500269923065401612') return;

        const embed = new EmbedBuilder()
            .setColor(0x00FF00) // Borde verde
            .setAuthor({ name: `Nueva sugerencia de ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .addFields({ name: ' 🪧 Sugerencia:', value: message.content })
            .setDescription('👔 La administración revisará tu sugerencia en breve.')
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512695455690264696/202ac9584888caeb09a136a0d8aa30fa.jpg?ex=6a2506ed&is=6a23b56d&hm=1c1e6b010a7d84719109cc73ce5b22fb744c637f66ab275df3c9527530140360&') // <-- Poné tu ID de imagen o URL acá
            .setFooter({ text: `${message.author.tag} | ${new Date().toLocaleDateString()}` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('aceptar_sugerencia').setLabel('Aceptar').setStyle(ButtonStyle.Success).setEmoji('✅'),
            new ButtonBuilder().setCustomId('rechazar_sugerencia').setLabel('Rechazar').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};