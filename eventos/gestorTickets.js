const { Events, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        // --- LÓGICA DE CREACIÓN ---
        if (interaction.customId.startsWith('ticket_')) {
            // Respondemos rápido para evitar el error 10062
            await interaction.deferReply({ ephemeral: true }).catch(() => {});

            const tipo = interaction.customId.split('_')[1];
            const categoriaID = '1511815644717256765';
            const rolStaff = '1512390208145068164';
            const rolSuperior = '1511522706493935757';

            const configuracion = {
                soporte: { 
                    titulo: '🆘·Soporte Caosmc Craft', 
                    desc: `🆘·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${interaction.user.id}> **escribe tu⚙️·problema y la razón del ticket y a continuación luego ⏰·espera pacientemente a que un miembro del STAFF atienda tu 🆘·ticket.**\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n\n•Para cerrar este ticket menciona a un STAFF 🔒`, 
                    roles: [1512390208145068164] 
                },
                alianza: { 
                    titulo: '📎·Alianza Caosmc Craft', 
                    desc: `📎·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${interaction.user.id}> 1️⃣·Debes Cumplir los requisitos.\n\n2️⃣·Ser Dueño o/a Administrador\n\n3️⃣·Subir Nuestra Plantilla en tu canal de alianza!\n\n4️⃣• Tener mas de 50 miembros sin contar bot \n\n5️⃣• Si elimina nuestra plantilla nosotros hacemos lo mismo.\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n\n•Para cerrar este ticket menciona a un STAFF🔒`, 
                    roles: [1512390208145068164] 
                },
                reporte: { 
                    titulo: '📋·Soporte Caosmc Craft', 
                    desc: `📋·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${interaction.user.id}> Rellene el 📋formulario:\n\n👤 • Nombre del reportado.\n📝 • Razón:\n📃 • Descripción del reporte:\n💾 • Pruebas:\n\n•Continuación luego ⏰·espera pacientemente a que un **STAFF** atienda tu 📋·ticket.\n\n·⚠️ Se paciente y no menciones a ningun miembro de la administración.\n\n•Para cerrar este ticket menciona a un STAFF🔒`, 
                    roles: [1512390208145068164] 
                },
                bugs: { 
                    titulo: '🔩·Soporte Caosmc Craft', 
                    desc: `🔩·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${interaction.user.id}> 🧾·informanos de tu problema luego espera pacientemente a que un 👨‍💻·miembro del staff se encargue de darte 👨‍🔧·soporte.\n\n**#Formato Reportes Bug Del Bot O Discord**\n\n📤 • Bug?:\n\n📝 • Descripción:\n\n💾 • Pruebas (Capturas de pantalla o videos):\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n\n•Para cerrar este ticket menciona a un STAFF 🔒`, 
                    roles: [1512390208145068164] 
                },
                hablar: { 
                    titulo: '🕴·Soporte Caosmc Craft', 
                    desc: `🕴·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${interaction.user.id}> Para Hablar Con El Dueño O Superior Escribe Su Ayuda\nY Se Paciente.\n\n•Continuación luego ⏰·espera pacientemente a que un <@&${rolSuperior}> atienda tu 📋·ticket.\n\n·⚠️ Se paciente y no menciones a ningun Administrador.\n\n•Para cerrar este ticket menciona a un Administrador🔒`, 
                    roles: [1511522706493935757] 
                }
            };

            const config = configuracion[tipo];
            if (!config) return;

            const channel = await interaction.guild.channels.create({
                name: `〘${tipo === 'soporte' ? '🆘' : tipo === 'alianza' ? '📎' : tipo === 'reporte' ? '📋' : tipo === 'bugs' ? '🔩' : '🕴'}〙•⏩${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: categoriaID,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    ...config.roles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
                ]
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: config.titulo })
                .setDescription(config.desc)
                .setColor(0xFF0000)
                .setFooter({ text: '👨‍💻·Equipo de Soporte Administración CAOSMC' })
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Cerrar Ticket').setStyle(ButtonStyle.Danger)
            );

            await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
            return interaction.editReply({ content: `✅ Ticket creado en ${channel}` }).catch(() => {});
        }

        // --- LÓGICA DE CIERRE ---
        if (interaction.customId === 'close_ticket') {
            await interaction.reply({ content: '🔒 Cerrando ticket...', ephemeral: true }).catch(() => {});
            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        }
    }
};
                        
