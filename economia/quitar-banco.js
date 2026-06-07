const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'quitar-banco',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});

        // Verificamos que sea el canal correcto
        if (!esCanalValido(message)) return;

        // 1. IDs de los roles autorizados
        const rolesAutorizados = ['1509746102415392808', '1506013227686039562'];

        // 2. Verificar si el usuario tiene al menos uno de los roles
        const tienePermiso = rolesAutorizados.some(roleId => message.member.roles.cache.has(roleId));

        if (!tienePermiso) {
            return message.reply('⛔️ No tenés el rol necesario para ejecutar esta acción.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Obtener usuario y monto
        const target = message.mentions.members.first();
        const monto = parseInt(args[0]);

        if (!target || !monto || isNaN(monto)) {
            return message.reply('⛔️ Uso correcto: `$quitar-banco [monto] @usuario`')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 4. Obtener datos del usuario desde la DB central
        db.ensure(target.id, { banco: 0 });
        const bancoActual = db.get(target.id, "banco");

        // 5. Verificar saldo suficiente
        if (bancoActual < monto) {
            return message.reply(`⛔️ <@${target.id}> no tiene suficiente dinero en el banco para quitarle (Tiene: **${bancoActual.toLocaleString()}$**).`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 6. Quitar el dinero del banco en la DB central
        db.math(target.id, "sub", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setAuthor({ name: `📥 Remover Banco`, iconURL: target.user.displayAvatarURL() })
            .setDescription(`El administrador <@${message.author.id}> le quitó **${monto.toLocaleString()}$** del banco a <@${target.id}>.`);

        message.channel.send({ embeds: [embed] });
    }
};

