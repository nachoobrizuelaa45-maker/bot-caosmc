const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'iniciar_postulacion',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('📋 ¿Cómo postular?')
            .setImage('URL_DE_TU_IMAGEN_AQUI')
            .setDescription(`
**--------------POSTULACIONES--------------
------------------- STAFF -------------------**

Ya puedes formar parte del 👔staff de Caosmc, 
este es un cargo muy importante el cual solo le concedemos 
a nuestros jugadores más ✨️veteranos y experimentados que 
se ofrezcan a ayudar en el crecimiento de la comunidad CAOSMC CRAFT.

**!**Para postular hay que cumplir ciertos requisitos OBLIGATORIOS:
🔮•Ser nivel 15 en discord o superior.
🔎•Responder Dudas.
🚫•Renunciar como jugador y concentrarse como staff.
🕛•Tener suficiente tiempo.
🎩•Ser paciente, educado y respetuoso.
📑•Tener reportes mínimos.
❤️•Ser leal a caosmc.

🛡️• REGLAS IMPORTANTES •🛡️
⚠️• el rol puede ser retirado si hay abuso de poder.
⚠️• no se puede dar items ilegales ni ayudar a jugadores de forma injusta en el servidor.
⚠️• si se postula estara a prueba por unos tiempos y cualquier comportamiento inadecuado se le retira rol staff.
⚠️• toda postulación sera revisada por la cupula administrativa. 

🔖 •ROLES DISPONIBLES• 🔖
📌 Helper | 📌 Moderador | 📌 Admin | 📌 Builder
📌 Configurador | 📌 Diseñador | 📌 Staff eventos

**📒¿Como postular?**
Si cumples con todos los requisitos pulsa en Postular.
            `);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('postulacion_start')
                .setLabel('👔 POSTULAR')
                .setStyle(ButtonStyle.Primary)
        );

        message.channel.send({ embeds: [embed], components: [row] });
    },
};
