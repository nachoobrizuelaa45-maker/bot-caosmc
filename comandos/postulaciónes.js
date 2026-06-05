const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'postulaciones',
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle("✨--------------POSTULACIONES--------------✨\n💎------------------- STAFF -------------------💎")
            .setColor(0x00FF00)
            .setDescription(
                "¡Hola! Ya podés formar parte del 👔 equipo **STAFF de Caosmc**. Este es un cargo muy importante el cual solo le concedemos a nuestros jugadores más ✨ veteranos y experimentados que se ofrezcan a ayudar en el crecimiento de la comunidad **CAOSMC CRAFT**.\n\n" +
                "**!** Para postular hay que cumplir ciertos requisitos OBLIGATORIOS:\n" +
                "🔮 • Ser nivel 15 en discord o superior.\n" +
                "🔎 • Responder Dudas.\n" +
                "🚫 • Renunciar como jugador y concentrarse como staff.\n" +
                "🕛 • Tener suficiente tiempo.\n" +
                "🎩 • Ser paciente, educado y respetuoso.\n" +
                "📑 • Tener reportes mínimos.\n" +
                "❤️ • Ser leal a caosmc.\n\n" +
                "🛡️ • REGLAS IMPORTANTES • 🛡️\n\n" +
                "⚠️ • El rol puede ser retirado si hay abuso de poder.\n" +
                "⚠️ • No se puede dar items ilegales ni ayudar a jugadores de forma injusta.\n" +
                "⚠️ • Si se postula estará a prueba y cualquier comportamiento inadecuado causará la retirada del rol.\n" +
                "⚠️ • Toda postulación será revisada por la cúpula administrativa.\n\n" +
                "🔖 • ROLES DISPONIBLES • 🔖\n\n" +
                "📌 **Helper** | 📌 **Moderador** | 📌 **Admin** | 📌 **Builder** | 📌 **Configurador** | 📌 **Diseñador** | 📌 **Staff eventos**\n\n" +
                "**📒 ¿Cómo postular?**\n" +
                "¡Elegí una de las opciones de abajo para empezar!"
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('staff_postular') 
                .setLabel('POSTULAR')
                .setStyle(ButtonStyle.Secondary) // Color gris
                .setEmoji('👔'),
            new ButtonBuilder()
                .setCustomId('staff_reportar')
                .setLabel('REPORTAR STAFF')
                .setStyle(ButtonStyle.Danger) // Color rojo
                .setEmoji('📋') // Emoji corregido
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};

