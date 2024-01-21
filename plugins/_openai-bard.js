const fetch = require('node-fetch');

const handler = async (m, { text, usedPrefix, command }) => {
  try {
  if (!text) throw 'Masukan Pertanyaan!\n*Contoh:* .ai Kapan Hari Batik?'
    await m.reply(global.wait);
    const apii = await fetch(`https://api.betabotz.eu.org/api/search/bard-ai?text=${text}&apikey=${lann}`);
    const res = await apii.json();

    conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: `${res.result}`, 
        contextInfo: {
          externalAdReply: {
            title: `Google Bard - ${text}`,
            body: 'Bard by api.betabotz.eu.org',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: `https://cdn.btch.bz/file/7374f975af935620a837b.jpg`,
            sourceUrl: 'http://wa.me/message/'
          }
        },
        mentions: [m.sender]
      }
    }, {});
  } catch (err) {
    console.error(err);
    throw err
  }
};

handler.command = handler.help = ['bard','bardai'];
handler.tags = ['tools'];
handler.premium = false
handler.limit = 2
module.exports = handler;
