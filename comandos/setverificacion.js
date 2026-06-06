const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setverificacion',
    execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ No tenés permisos para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setTitle("🔒 • Sistema de Verificación CAOSMC 🚀")
            .setColor(0x00FF00) // Borde verde
            .setDescription(
                "🎉 • ¡Bienvenido a la comunidad CAOSMC!\n\n" +
                "Para acceder a todos nuestros canales, recibir noticias, y estar al tanto de las últimas actualizaciones, solo debes hacer clic en (VERIFICATE) y obtendrás el rol de  👋 • nuevo . Únete y disfruta de todos los beneficios que te ofrecemos. 🚀"
            )
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512654936310284288/Picsart_26-06-06_00-08-11-550.jpg?ex=6a24e130&is=6a238fb0&hm=a6a12d9875cdc8e8382c88fd6b9dbcda0722ad6cab37d2ba1fd22e3778001aec&')
            .setFooter({ text: '📢 •Gracias por ser parte de CAOSMC | Equipo de Soporte 💻' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verificar_caosmc')
                .setLabel('Verificate')
                .setStyle(ButtonStyle.Success) // Ahora es verde (Success)
                .setEmoji('1512619522161508432') // ID directo para mejor compatibilidad
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
