const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dar-banco',
    async execute(message, args) {
        // 1. Lista de IDs permitidos (Owners)
        const allowedOwners = ['1506013227686039562', '1509746102415392808'];

        // 2. Verificar si el usuario que ejecuta el comando es un Owner
        if (!allowedOwners.includes(message.author.id)) {
            return message.reply('⛔️ No tenés permiso para usar este comando.');
        }

        // 3. Obtener usuario y monto
        const target = message.mentions.members.first();
        const monto = parseInt(args[0]);

        if (!monto || isNaN(monto) || !target) {
            return message.reply('⛔️ Uso correcto: `$dar-banco [monto] @usuario`');
        }

        // 4. Sumar al banco del usuario
        db.math(target.id, "add", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('🤑 Pago Millonario')
            .setDescription(`El administrador <@${message.author.id}> ha depositado **${monto.toLocaleString()}$** a <@${target.id}> de parte de la administración.`);

        message.channel.send({ embeds: [embed] });
        
        // Borrar el mensaje del comando para limpieza
        message.delete().catch(() => {});
    }
};
