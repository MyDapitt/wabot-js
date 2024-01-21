const fetch = require('node-fetch');

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `Contoh:\n${ usedPrefix + command} https://vm.tiktok.com/ZSL7GK5PP`;
    }

    m.reply('Sedang mengunduh...');

    try {
        let res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${args[0]}`);
        if (!res.ok) {
            throw 'Terjadi kesalahan saat mengunduh video TikTok.';
        }

        let f = await res.json();
        if (!f) {
            throw 'Tidak dapat mengambil data video TikTok.';
        }

        let vid = f.video.noWatermark;
        let aud = f.music.play_url;

        const ftroli = {
            key: {
                participant: '0@s.whatsapp.net'
            },
            message: {
                orderMessage: {
                    itemCount: `${f.video.duration}`,
                    status: 1,
                    surface: 1,
                    message: `${f.author.name}`,
                    orderTitle: 'Tiktok Downloader',
                    thumbnail: `${f.video.cover}`,
                    sellerJid: '0@s.whatsapp.net'
                }
            }
        };

        await conn.sendFile(m.chat, vid, 'tiktok.mp4', `*Tiktok Downloader*\nUploaded by _${f.author.name}_\n${f.title}\n\n*LIKE: ${f.stats.likeCount}*\n*COMMENT: ${f.stats.commentCount}*\n*SHARE: ${f.stats.shareCount}*`, m);

        await conn.sendMessage(m.chat, {
            audio: {
                url: aud
            },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: `${f.music.title}`,
                    body: `${f.music.author}`,
                    thumbnailUrl: `${f.music.cover_hd}`,
                    sourceUrl: 'http://s.id/sh0rt',
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        throw `Terjadi kesalahan: ${error}`;
    }
};

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|tiktod|dltt)$/i;
handler.limit = true;

module.exports = handler;
