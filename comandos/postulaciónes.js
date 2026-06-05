const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'postulaciones',
    execute(message) {
        // 1. EL EMBED CON TODA LA INFO
        const embed = new EmbedBuilder()
            .setTitle("✨--------------POSTULACIONES--------------✨\n💎------------------- STAFF -------------------💎")
            .setColor(0x00FF00)
            .setDescription(
                "Ya puedes formar parte del 👔staff de Caosmc, este es un cargo muy importante el cual solo le concedemos a nuestros jugadores más ✨️veteranos y experimentados que se ofrezcan a ayudar en el crecimiento de la comunidad CAOSMC CRAFT.\n\n" +
                "**!**Para postular hay que cumplir ciertos requisitos OBLIGATORIOS:\n" +
                "🔮•Ser nivel 15 en discord o superior.\n" +
                "🔎•Responder Dudas.\n" +
                "🚫•Renunciar como jugador y concentrarse como staff.\n" +
                "🕛•Tener suficiente tiempo.\n" +
                "🎩•Ser paciente, educado y respetuoso.\n" +
                "📑•Tener reportes mínimos.\n" +
                "❤️•Ser leal a caosmc.\n\n" +
                "🛡️• REGLAS IMPORTANTES •🛡️\n\n" +
                "⚠️• el rol puede ser retirado si hay abuso de poder.\n" +
                "⚠️• no se puede dar items ilegales ni ayudar a jugadores de forma injusta en el servidor.\n" +
                "⚠️• si se postula estara a prueba por unos tiempos y cualquier comportamiento inadecuado se le retira rol staff.\n" +
                "⚠️• toda postulación sera revisada por la cupula administrativa.\n\n" +
                "🔖 •ROLES DISPONIBLES• 🔖\n\n" +
                "📌 Helper | 📌 Moderador | 📌 Admin | 📌 Builder | 📌 Configurador | 📌 Diseñador | 📌 Staff eventos"
            );

        // 2. LOS BOTONES ESTILO IMAGEN
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('staff_postular') 
                .setLabel('POSTULAR')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('👔'),
            new ButtonBuilder()
                .setCustomId('staff_reportar')
                .setLabel('REPORTAR')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('📝')
        );

        // 3. ENVIAMOS EL MENSAJE
        // El texto de la parte superior que se ve en la imagen:
        message.channel.send({ 
            content: '🗳️ •Postulaciones STAFF servidor\nCAOSMC', 
            embeds: [embed], 
            components: [row] 
        });
        
        message.delete().catch(() => {});
    }
};
