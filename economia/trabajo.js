const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js[span_1](start_span)[span_1](end_span)

module.exports = {
    name: 'trabajos',
    async execute(message, args) {
        // Borramos el comando original apenas se ejecuta
        message.delete().catch(() => {});

        const accion = args[0];
        const nombreTrabajo = args.slice(1).join(" ");

        const listaTrabajos = [
            { emoji: '🚜', nombre: 'Agricultor', req: 0 },
            { emoji: '🐟', nombre: 'Pescador', req: 50 },
            { emoji: '🍖', nombre: 'Carnicero', req: 100 },
            { emoji: '🍳', nombre: 'Cocinero', req: 150 },
            { emoji: '🛵', nombre: 'Repartidor', req: 250 },
            { emoji: '🚕', nombre: 'Taxista', req: 350 },
            { emoji: '🚚', nombre: 'Camionero', req: 500 },
            { emoji: '🚛', nombre: 'Basurero', req: 600 },
            { emoji: '🔧', nombre: 'Mecanico', req: 700 },
            { emoji: '🔌', nombre: 'Electricista', req: 800 },
            { emoji: '🚌', nombre: 'Conductor', req: 900 },
            { emoji: '✈️', nombre: 'Piloto', req: 1000 },
            { emoji: '💎', nombre: 'Minero', req: 1200 },
            { emoji: '🚑', nombre: 'Medico', req: 1400 },
            { emoji: '🚓', nombre: 'Policia', req: 1500 },
            { emoji: '🗡️', nombre: 'Armero', req: 2000 },
            { emoji: '🔑', nombre: 'Traficante', req: 2500 },
            { emoji: '💀', nombre: 'Sicario', req: 3000 }
        ];

        // --- LÓGICA SI EL USUARIO QUIERE FIRMAR ---
        if (accion === 'firmar') {
            const trabajoElegido = listaTrabajos.find(t => t.nombre.toLowerCase() === nombreTrabajo.toLowerCase());
            
            if (!trabajoElegido) return message.reply('❌ Ese trabajo no existe.').then(msg => setTimeout(() => msg.delete(), 5000));

            // Nos aseguramos de tener la estructura base en la DB central
            db.ensure(message.author.id, { trabajos: 0, dinero: 0, trabajoActual: 'Desempleado' });

            const totalTrabajos = db.get(message.author.id, "trabajos") || 0;

            if (totalTrabajos < trabajoElegido.req) {
                return message.reply(`⛔️ ¡Necesitás ${trabajoElegido.req} trabajos realizados! Tenés ${totalTrabajos}.`).then(msg => setTimeout(() => msg.delete(), 5000));
            }

            db.set(message.author.id, trabajoElegido.nombre, "trabajoActual");
            
            const embedConfirm = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ ¡Contrato Firmado!')
                .setDescription(`Ahora trabajás como **${trabajoElegido.nombre}**.\n¡Ponete a trabajar con \`$trabajar\`!`);

            return message.channel.send({ embeds: [embedConfirm] });
        }

        // --- LÓGICA SI SOLO QUIERE VER LA LISTA ---
        const descripcion = listaTrabajos.map(t => 
            `${t.emoji} **${t.nombre}**: ${t.req} trabajos realizados`
        ).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('🏗️ Trabajos Disponibles')
            .setDescription(`**•• TRABAJOS FORTUNA ••**\n\n${descripcion}\n\nPara firmar, escribí: \`$trabajos firmar [nombre]\``);

        message.channel.send({ embeds: [embed] });
    }
};

