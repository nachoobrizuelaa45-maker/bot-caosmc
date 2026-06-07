const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'dar-efectivo',
    async execute(message, args) {
        // 0. Verificamos si es el canal correcto
        if (!esCanalValido(message)) return;

        // 1. IDs de los ROLES permitidos
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];

        // 2. Verificar si el usuario tiene alguno de los roles permitidos
        const hasRole = allowedRoles.some(roleId => message.member.roles.cache.has(roleId));

        if (!hasRole) {
            // Si no tiene rol, borramos el mensaje para mantener la limpieza
            message.delete().catch(() => {});
            return message.reply('⛔️ No tenés el rol necesario para usar este comando.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Obtener datos
        const monto = parseInt(args[0]);
        const target = message.mentions.members.first();

        if (!monto || isNaN(monto) || !target) {
            message.delete().catch(() => {});
            return message.reply('⛔️ Uso correcto: `$dar-efectivo [monto] @usuario`').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 4. Sumar al efectivo del usuario
        db.math(target.id, "add", monto, "dinero");

        // 5. Embed solo con la cantidad entregada
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`💸 Se entregaron **${monto.toLocaleString()}$** a <@${target.id}>.`);

        message.channel.send({ embeds: [embed] });
        
        // 6. Limpieza: Borrar el comando del admin
        message.delete().catch(() => {});
    }
};

