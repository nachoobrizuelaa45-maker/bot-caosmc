const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'iniciar_postulacion',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('📋 ¿Cómo postular?')
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512141761521385675/1780593058694.png?ex=6a230342&is=6a21b1c2&hm=846dcb05b400a591e799cc5bcc3a48adf0955837599e3535fb73af9a34ccef47&')
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
