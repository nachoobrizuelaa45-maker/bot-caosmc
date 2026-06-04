const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setverificacion',
    description: 'Envía el mensaje de verificación de CAOSMC',
    execute(message, args) {
        // Verificación de seguridad
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ No tenés permisos para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000') // Borde izquierdo rojo
            .setDescription(
                "🎉·Bienvenido a CAOSMC, \n" +
                "sigue los siguientes pasos para completar la ✅verificación.\n\n" +
                "1️⃣**·PASO 1:** **👀·**Leer y acepta las [normativas y reglas](https://discord.com/channels/1500269922507296978/1500269923065401607).\n" +
                "2️⃣**·PASO 2:** Pulsa en 🛡️ Verificar."
            )
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512055109280993442/1780570851644.png?ex=6a22b28e&is=6a21610e&hm=358531a1b8d62184f411c279d4619916906bcd755193dda30b25273719bc34d0&')
            .setFooter({ text: '🔰·Al verificarte aceptas cumplir con todas y cada una de nuestras 📜 #reglas.' });

        const boton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verificar_caosmc')
                    .setLabel('VERIFICAR')
                    .setEmoji('🛡️')
                    .setStyle(ButtonStyle.Secondary) // Botón color gris
            );

        message.channel.send({ embeds: [embed], components: [boton] });
    },
};
