const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    execute(client) {
        const canalLogID = '1510257715430162552';

        // 1. Log de mensajes eliminados
        client.on(Events.MessageDelete, (message) => {
            if (message.author?.bot) return;
            const channel = message.guild?.channels.cache.get(canalLogID);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle('🗑️ Mensaje Eliminado')
                .setColor(0xFF0000)
                .setDescription(`Un mensaje fue eliminado en ${message.channel}`)
                .addFields(
                    { name: 'Autor', value: `${message.author?.tag || 'Desconocido'}`, inline: true },
                    { name: 'Contenido', value: message.content || 'Sin contenido (o archivo/imagen)' }
                )
                .setTimestamp();
            channel.send({ embeds: [embed] }).catch(console.error);
        });

        // 2. Log de usuarios baneados
        client.on(Events.GuildBanAdd, (ban) => {
            const channel = ban.guild.channels.cache.get(canalLogID);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle('🔨 Usuario Baneado')
                .setColor(0x000000)
                .setDescription(`El usuario **${ban.user.tag}** ha sido baneado.`)
                .setTimestamp();
            channel.send({ embeds: [embed] }).catch(console.error);
        });
    }
};
