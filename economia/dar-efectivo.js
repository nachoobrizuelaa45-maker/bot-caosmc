const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dar-efectivo',
    async execute(message, args) {
        // 1. IDs de los ROLES permitidos
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];

        // 2. Verificar si el usuario tiene alguno de los roles permitidos
        const hasRole = allowedRoles.some(roleId => message.member.roles.cache.has(roleId));

        if (!hasRole) {
            return message.reply('⛔️ No tenés el rol necesario para usar este comando.');
        }

        // 3. Obtener datos
        const monto = parseInt(args[0]);
        const target = message.mentions.members.first();

        if (!monto || isNaN(monto) || !target) {
            return message.reply('⛔️ Uso correcto: `$dar-efectivo [monto] @usuario`');
        }

        // 4. Sumar al efectivo del usuario
        db.math(target.id, "add", monto, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `💸 Administración`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`El administrador <@${message.author.id}> le ha dado **${monto.toLocaleString()}$** a <@${target.id}> de parte de la administración.`);

        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
    
