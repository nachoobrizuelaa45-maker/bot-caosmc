const { exec } = require('child_process');

module.exports = {
    name: 'restart',
    execute(message, args) {
        const allowedRoles = ['1506013227686039562', '1509746102415392808'];
        if (!message.member.roles.cache.some(r => allowedRoles.includes(r.id))) {
            return message.reply('🚫 No tenés permisos.');
        }

        message.reply('🔄 Ejecutando reinicio de CAOSMC...').then(() => {
            // Ejecutamos el script y luego el reinicio de PM2
            exec('./iniciar.sh && pm2 restart CAOSMC', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
            });
        });
    }
};
