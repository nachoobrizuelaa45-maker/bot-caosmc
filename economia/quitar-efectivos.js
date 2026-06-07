const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'quitar-efectivo',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});

        // Verificamos que sea el canal correcto
        if (!esCanalValido(message)) return;

        // 1. IDs de los roles autorizados
        const rolesAutorizados = ['1509746102415392808', '1506013227686039562'];

        // 2. Verificar si el usuario que ejecuta el comando tiene al menos uno de los roles
        const tienePermiso = rolesAutorizados.some(roleId => message.member.roles.cache.has(roleId));

        if (!tienePermiso) {
            return message.reply('⛔️ No tenés el rol necesario para ejecutar esta acción.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Obtener usuario y monto
        const monto = parseInt(args[0]);
        const target = message.mentions.members.first();

        if (!monto || isNaN(monto) || !target) {
            return message.reply('⛔️ Uso correcto: `$quitar-efectivo [monto] @usuario`')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 4. Obtener datos de la DB central
        db.ensure(target.id, { dinero: 0 });
        const dineroActual = db.get(target.id, "dinero");

        // 5. Verificar saldo
        if (dineroActual < monto) {
            return message.reply(`⛔️ <@${target.id}> no tiene suficiente efectivo para quitarle. Tiene: **${dineroActual.toLocaleString()}$**`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 6. Realizar la operación en la DB central
        db.math(target.id, "sub", monto, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0xE91E63)
            .setAuthor({ name: `🤑 Quitar Efectivo`, iconURL: target.user.displayAvatarURL() })
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`El administrador <@${message.author.id}> le quitó **${monto.toLocaleString()}$** de los bolsillos a <@${target.id}>.`)
            .setFooter({ text: `${message.member.displayName} • ${new Date().toLocaleTimeString()}` });

        message.channel.send({ embeds: [embed] });
    }
};

