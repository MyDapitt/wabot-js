const fetch = require('node-fetch');

const handler = async (m, { text, usedPrefix, command }) => {
  try {
  if (!text) throw 'Masukan Pertanyaan!\n*Contoh:* .ai Kapan Hari Batik?'
    await m.reply(global.wait);
    const apii = await fetch(`https://aemt.me/openai?text=${text}`);
    const res = await apii.json();

    conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: `${res.result}`, 
        contextInfo: {
          externalAdReply: {
            title: `Search - ${text}`,
            body: 'OpenAI by aemt.me',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: `https://up.onee.eu.org/cdn/Bqo0f5DMtLPB.jpg`,
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

handler.command = handler.help = ['ai', 'openai', 'chatgpt'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = 2

module.exports = handler;