let d = new Date(new Date().getTime() + 3600000);
let moment = require('moment-timezone');
let date = d.toLocaleDateString('id', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
let time = moment.tz('Asia/Jakarta').format("HH:mm:ss");

global.owner = ['6283171710709', '62831717107092', '99440091859'];
global.mods = ['6283171710709'];
global.prems = ['6283171710709'];
global.nameowner = 'Davitt';
global.numberowner = '6283171710709';
global.mail = 'me@dapitt.eu.org';
global.gc = 'https://chat.whatsapp.com/Ln2vHjRrRayAbzalRMB56r';
global.instagram = 'https://instagram.com/davidpangrib001';
global.wm = '\n\n_Simple WhatsApp Bot_\n\n';
global.wait = '_Mohon Tunggu..._';
global.error = '_Terjadi Kesalahan.._';
global.sticker_wait = '_Membuat Stiker.._';
global.packname = 'Bot WhatsApp Stiker';
global.author = `This sticker was created on:\nDate: ${date}\n`;
global.maxwarn = '3'; // Peringatan maksimum
// INI WAJIB DI ISI!
global.btc = 'major'; // Daftar terlebih dahulu https://api.botcahx.eu.org
// INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA
global.lann = 'YOb75QGn'; // Daftar https://api.betabotz.eu.org
global.APIs = {
  btc: 'https://api.botcahx.eu.org'
};
global.APIKeys = {
  'https://api.botcahx.eu.org': 'major'
};
let fs = require('fs');
let chalk = require('chalk');
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});