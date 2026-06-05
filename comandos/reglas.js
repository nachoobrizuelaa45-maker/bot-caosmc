const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reglas',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor(0x00008B) // Color azul oscuro para el borde lateral
            .setTitle("💬 REGLAS DEL DISCORD — CAOSMCCRAFT")
            .setDescription(
                "1️⃣ Respeta a todos los miembros.\n" +
                "2️⃣ No spam, flood ni mayúsculas excesivas.\n" +
                "3️⃣ No contenido NSFW o inapropiado.\n" +
                "4️⃣ No publicidad de otros servidores.\n" +
                "5️⃣ Usa cada canal correctamente.\n" +
                "6️⃣ No menciones masivas (@everyone/@here).\n" +
                "7️⃣ No compartas información personal.\n" +
                "8️⃣ Sigue las indicaciones del staff.\n" +
                "9️⃣ No toxicidad extrema ni acoso.\n" +
                "🔟 Mantén un ambiente limpio y divertido ⚔️\n\n" +
                "⚔️ **REGLAS DEL SERVIDOR — CAOSMCCRAFT**\n\n" +
                "1️⃣ No usar hacks, cheats o clientes modificados.\n" +
                "2️⃣ No aprovechar bugs o errores del servidor.\n" +
                "3️⃣ No hacer spam en chat.\n" +
                "4️⃣ Respeta a todos los jugadores y staff.\n" +
                "5️⃣ No construir contenido ofensivo o inapropiado.\n" +
                "6️⃣ No robar cuentas ni intentar estafas.\n" +
                "7️⃣ PvP permitido solo donde el servidor lo permita.\n" +
                "8️⃣ Las decisiones del staff deben respetarse.\n" +
                "9️⃣ El uso de multicuentas abusivas está prohibido.\n" +
                "🔟 Diviértete y juega limpio ⚔️"
            )
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512572858218320043/1780695635643.png?ex=6a2494bf&is=6a23433f&hm=6b28ea754d8dbff44a7bd7b51bb0c91e23e55ee19e1481b0e2e405f9808a36b8&')
            .setFooter({ text: 'CAOSMC CRAFT - Respeta las reglas para una mejor convivencia.' });

        // Enviamos el mensaje con el embed y las menciones arriba
        message.channel.send({ content: '@everyone @here', embeds: [embed] });
        message.delete().catch(() => {});
    }
};
