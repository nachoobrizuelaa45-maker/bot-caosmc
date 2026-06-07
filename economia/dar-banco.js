const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'dar-banco',
    async execute(message, args) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});

        // Verificamos que sea el canal correcto
        if (!esCanalValido(message)) return;

        // 1. IDs de los roles autorizados
        const rolesAutorizados = ['1509746102415392808', '1506013227686039562'];

        // 2. Verificar si el usuario tiene alguno de los roles
        const tienePermiso = rolesAutorizados.some(roleId => message.member.roles.cache.has(roleId));

        if (!tienePermiso) {
            return message.reply('⛔️ No tenés el rol necesario para ejecutar esta acción.')
                .then(msg => setTimeout(() => msg.delete(), 5000)); // Limpieza automática del error
        }

        // 3. Obtener usuario y monto
        const target = message.mentions.members.first();
        const monto = parseInt(args[0]);

        if (!monto || isNaN(monto) || !target) {
            return message.reply('⛔️ Uso correcto: `$dar-banco [monto] @usuario`')
                .then(msg => setTimeout(() => msg.delete(), 5000)); // Limpieza automática del error
        }

        // 4. Asegurar estructura en la DB central y realizar el depósito
        db.ensure(target.id, { banco: 0 });
        db.math(target.id, "add", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('🤑 Pago Millonario')
            .setDescription(`El administrador <@${message.author.id}> ha depositado **${monto.toLocaleString()}$** a <@${target.id}> de parte de la administración.`);

        message.channel.send({ embeds: [embed] });
    }
};

