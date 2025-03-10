/*
/*************************
* Kalo mau pake tinggal pake aja 
* jangan hapus sumber nya
* Github : BOTCAHX 
* Source Code : https://github.com/BOTCAHX/whatsapp-gpt
**************************
*/
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { platform } = require('node:os');
const os = require('os');
const uploader = require('./lib/upload_file');
const { askGPT, GptGo } = require('./lib/gpt_bot');
const chalk = require('chalk');
const { puppeteer } = require('puppeteer');
const { fromBuffer } = require('file-type');
const fetch = require('node-fetch');
const BASE_URL = 'https://aemt.me'

const emoji_loading = [
  '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛',
  '🕜', '🕤', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'
];
const react_loading = emoji_loading[Math.floor(Math.random() * emoji_loading.length)];
const react_done = '✔️'

const client = new Client({
        authStrategy: new LocalAuth({
        // proxyAuthentication: { username: 'username', password: 'password' },
        clientId: 'whatsapp-web',
        dataPath: './sessions'
    }),
    puppeteer: {
        headless: true,
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", 
      "--disable-gpu",
    ],
        authStrategy: new LocalAuth(),
        executablePath: platform() === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable'
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.133'
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

console.log(client)

client.on("qr", (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', message => {
// jika pemulihan sesi tidak berhasil
    console.error('AUTHENTICATION FAILURE', message);
});

// auto reject jika telpon masuk
client.on("call", async call => {
  await call.reject();
  await client.sendMessage(call.from, `\`\`\`This number can only receive text messages!\`\`\``)
});

client.on('ready', async () => {
    console.log(`${JSON.stringify(client.info)}`)
});

client.initialize(); 

// message responses
client.on("message", async (message) => {
  console.log(chalk.bgYellow.black(`${message.fromMe ? 'Me' : message.from}`));
  console.log(chalk.cyan(`> ${message.body}`));

  const text = message.body.toLowerCase();
  // List fitur bot 
  if (text.includes(".ai")) {
    try {      
      const inputText = text.replace(".ai", "");
      if (!inputText) return message.reply('Enter questions!')
      message.react(react_loading);
      const chats = await askGPT(inputText);      
      console.log(chalk.bgGreen.black(`> ${chats.result}`)); 
          
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://missuo.ru/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `Using whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
      message.react(react_done);
    } catch (e) {
      console.log(e);
    }
   } else if (text.includes(".c-ai")) {   
    const inputtext = text.replace(".c-ai", "");
    if (!inputtext) return message.reply('Example: *.c-ai kirito|hai what is your name?*')
    let [ prompt1, prompt2 ] = inputtext.split('|')
    if (!prompt1 || !prompt2) {
        await message.reply('Example: *.c-ai kirito|hai what is your name?*');
    } else {       
        message.react(react_loading);
        try {
            const chats = await fetch(BASE_URL + `/ai/c-ai` + `?prompt=${prompt1}` + `&text=${prompt2}`).then(res => res.json());
            console.log(chalk.bgGreen.black(`> ${chats.result}`));
            
            async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
            message.react(react_done);
        } catch (e) {
            console.log(e);
        }
      }
    } else if (text.includes(".gptgo")) {
    try {
      const inputText = text.replace(".gptgo", "");
       if (!inputText) return message.reply('Enter questions!')
       message.react(react_loading);
      const chats = await GptGo(inputText);     
      console.log(chalk.bgGreen.black(`> ${chats.result}`));
      
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
      message.react(react_done);
    } catch (e) {
      console.log(e);
    }
    } else if (text.includes(".gpt4")) {
    try {
      const inputText = text.replace(".gpt4", "");
       if (!inputText) return message.reply('Enter questions!')
       message.react(react_loading);
      const chats = await fetch(BASE_URL + `/gpt4` + `?text=${inputText}`).then(response => response.json())
      console.log(chalk.bgGreen.black(`> ${chats.result}`));
      
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
      message.react(react_done);
    } catch (e) {
      console.log(e);
    }
    } else if (text.includes(".dalle")) {
      try {
        const inputText = text.replace(".dalle", "");
         if (!inputText) return message.reply('Input parameter text!')
        message.react(react_loading);
        const res = await fetch(BASE_URL + `/dalle` + `?text=${encodeURIComponent(inputText)}`).then(response => response.buffer())       
        const response = new MessageMedia((await fromBuffer(res)).mime, res.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt: ${inputText}`, quotedMessage: message.id._serialized });        
        message.react(react_done);
    } catch (e) {
        console.log(e);
    }
    } else if (text.includes(".sticker", ".s", ".stiker")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) await client.sendMessage(message.from, `Reply image messages with caption .sticker!`)                 
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: "E1", stickerName: "(c) 2024", stickerCategories: ["😁", "😆"]});
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }   
     }
    else if (text.includes("bot")) {
        await message.react('☺️');
        const kata2 = ['Hi!', 'Hey, yo', 'Active :)', 'Ada apa sayang..', 'Iya sayang, aku ada disini..'];
        const katanya = kata2[Math.floor(Math.random() * kata2.length)];
        await message.reply(katanya);
     } else if (text.includes(".bardimg")) {
    try {
      const inputText = text.replace(".bardimg", "");
      if (!inputText) return message.reply('Input parameter text!')
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image messages with caption *.bardimg*')                     
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)        
        const bard = await fetch(BASE_URL + `/bardimg` + `?url=${cloud}` + `&text=${encodeURIComponent(inputText)}}`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${bard.result}`));
        
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, bard.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    } 
   } else if (text.includes(".bard")) {
    try {
      const inputText = text.replace(".bard", "");
       if (!inputText) return message.reply('Enter questions!')
       message.react(react_loading);
      const chats = await fetch(BASE_URL + `/bard` + `?text=${inputText}`).then(response => response.json())
      console.log(chalk.bgGreen.black(`> ${chats.result}`));
      
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
      message.react(react_done);
    } catch (e) {
      console.log(e);
    }     
      } else if (text.includes(".bing")) {
    try {
      const inputText = text.replace(".bing", "");
       if (!inputText) return message.reply('Enter questions!')
       message.react(react_loading);
      const chats = await fetch(BASE_URL + `/bingai` + `?text=${inputText}`).then(response => response.json())
      console.log(chalk.bgGreen.black(`> ${chats.result}`));
      
      async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
      await client.sendMessage(message.from, chats.result, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
      message.react(react_done);
    } catch (e) {
      console.log(e);
    }
     } else if (text.includes(".removebg")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image messages with caption *.removebg*')          
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)
        const remove = await fetch(BASE_URL + `/removebg` + `?url=${cloud}`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${remove.url.result}`));
        const imgs = await fetch(remove.url.result).then(res => res.buffer())
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `✔️ Done`, quotedMessage: message.id._serialized });               
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
      } else if (text.includes(".remini")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
          if (!quotedMsg) return message.reply('Reply image messages with caption *.remini*')          
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)        
        const remini = await fetch(BASE_URL + `/remini` + `?url=${cloud}` + `&resolusi=4`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${remini.url.url}`));
        const imgs = await fetch(remini.url).then(res => res.buffer())
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))        
        await client.sendMessage(message.from, response, { caption: `✔️ Done`, quotedMessage: message.id._serialized });        
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
      } else if (text.includes(".tozombie")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image messages with caption *.tozombie*')             
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)        
        const zombie = await fetch(BASE_URL + `/converter/zombie` + `?url=${cloud}`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${zombie.url}`));
        const imgs = await fetch(zombie.url).then(res => res.buffer())
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `✔️ Done`, quotedMessage: message.id._serialized });          
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
      } else if (text.includes(".toanime")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image messages with caption *.toanime*')                     
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)        
        const anime = await fetch(BASE_URL + `/toanime` + `?url=${cloud}`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${anime.url.img_crop_single}`));
        const imgs = await fetch(anime.url.img_crop_single).then(res => res.buffer())
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `✔️ Done`, quotedMessage: message.id._serialized });               
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
     } else if (text.includes(".togta")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image messages with caption *.togta*')                     
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)        
        const gta = await fetch(BASE_URL + `/jadigta` + `?url=${cloud}`).then(response => response.json());
        console.log(chalk.bgGreen.black(`> ${gta.result}`));
        const imgs = await fetch(gta.result).then(res => res.buffer())
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `✔️ Done`, quotedMessage: message.id._serialized });               
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
     } else if (text.includes(".tourl")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) return message.reply('Reply image/file messages with caption *.tourl*')          
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react(react_loading);
        const media = await quotedMsg.downloadMedia();
        const buffer = Buffer.from(media.data, 'base64');
        const cloud = await uploader(buffer)               
await message.reply(`
*Uploader*
MimeType: ${media.mimetype}
Data (length): ${media.data.length}
Preview: ${cloud}`)       
        message.react(react_done);
      }
    } catch (e) {
      console.log(e);
    }
    } else if (text.includes(".text2img")) {
      try {        
        const inputText = text.replace(".text2img", "");
        if (!inputText) return message.reply('Enter parameter text!')
        message.react(react_loading);
        const res = await fetch(BASE_URL + `/ai/text2img` + `?text=${encodeURIComponent(inputText)}`).then(response => response.buffer());      
        const response = new MessageMedia((await fromBuffer(res)).mime, res.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt: ${inputText}`, quotedMessage: message.id._serialized });        
        message.react(react_done);
    } catch (e) {
        console.log(e);
    }
      } else if (text.includes(".bimg")) {
      try {        
        const inputText = text.replace(".bimg", "");
        if (!inputText) return message.reply('Enter parameter text!')
        message.react(react_loading);
        const res = await fetch(BASE_URL + `/bingimg` + `?text=${encodeURIComponent(inputText)}`).then(response => response.json()); 
        const imgs = await fetch(res.result).then(result => result.buffer());
        const response = new MessageMedia((await fromBuffer(imgs)).mime, imgs.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt: ${inputText}`, quotedMessage: message.id._serialized });        
        message.react(react_done);
    } catch (e) {
        console.log(e);
    }
    } else if (text.includes(".stablediffusion")) {
      try {        
        const inputText = text.replace(".stablediffusion", "");
        if (!inputText) return message.reply('Enter parameter text!')
        message.react(react_loading);
        const res = await fetch(BASE_URL + `/stablediffusion` + `?text=${encodeURIComponent(inputText)}`).then(response => response.buffer());      
        const response = new MessageMedia((await fromBuffer(res)).mime, res.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt: ${inputText}`, quotedMessage: message.id._serialized });        
        message.react(react_done);
    } catch (e) {
        console.log(e);
    }        
    } else if (text.includes(".info")) {
    try {
      let info = client.info;
      let _uptime = process.uptime() * 1000
      let timer = clockString(_uptime)
      let time = require('moment-timezone').tz('Asia/Jakarta').format('HH:mm:ss')
        client.sendMessage(message.from, `
┌ *INFO*
│ ◦ Runtime: ${timer}
│ ◦ User name: ${info.pushname}
│ ◦ My number: ${info.wid.user}
│ ◦ Platform: ${info.platform}
└
`);
    function clockString(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + "d " + hours + "h " + minutes + "m " + sec + "s ";
}
    } catch (e) {
      console.log(e);
    } 
  } else if (text.includes(".snapshot")) {
    try {
     const pages = await client.pupBrowser.pages();
     const page = pages[0];     
     const screenshot = await page.screenshot({ fullPage: true });
     const response = new MessageMedia((await fromBuffer(screenshot)).mime, screenshot.toString("base64"))
     await client.sendMessage(message.from, response, { caption: `*Snapshot Browser*`, quotedMessage: message.id._serialized });     
    } catch (e) {
      console.log(e);
    } 
  } 
  else if (text.includes(".ss")) {
  try {
    const link = text.replace(".ss", "").trim(); // Trim whitespace from the link
    if (!link) return message.reply('Enter link!');

    const screenshotBuffer = await fetch(BASE_URL + `/sspc?url=${encodeURIComponent(link)}`).then(response => response.buffer());
    
    const responseMedia = new MessageMedia((await fromBuffer(screenshotBuffer)).mime, screenshotBuffer.toString("base64"));

    // Menggunakan quotedMessageObj.id untuk mendapatkan ID pesan yang dikutip
    const quotedMessageObj = await message.getQuotedMessage();
    if (!quotedMessageObj) return message.reply('Quoted message not found.');

    await client.sendMessage(message.from, responseMedia, { caption: `*Screenshot from:*\n${link}`, quotedMessageId: quotedMessageObj.id });
  } catch (e) {
    console.error(e);
    message.reply(`Error!\n${e}`);
  }
}
  else if (text.includes(".groups")) {
    try {
        client.getChats().then(chats => {
            const groups = chats.filter(chat => chat.isGroup);

            if (groups.length == 0) {
                message.reply('You have no group yet.');
            } else {
                let replyMsg = '*GROUPS*\n\n';
                groups.forEach((group, i) => {
                    replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
                });
                message.reply(replyMsg);
            }
        });
    } catch (e) {
        console.log(e);
    }    
  } else if (text.includes(".menu")) {  // Menu
    const r_menu = ` 
◦ *Browser Version*  :  ${await client.getWWebVersion()}
◦ *Library Version* : ${require('whatsapp-web.js/package.json').version}\n
┌ *MENU*
│ ◦ ai
│ ◦ gptgo
│ ◦ gpt4
│ ◦ c-ai
│ ◦ dalle
│ ◦ bard
│ ◦ bardimg
│ ◦ bing
│ ◦ bimg
│ ◦ text2img
│ ◦ sticker
│ ◦ remini
│ ◦ toanime
│ ◦ togta
│ ◦ tozombie
│ ◦ stablediffusion
│ ◦ removebg
│ ◦ tourl
│ ◦ info
│ ◦ groups
│ ◦ menu
│ ◦ snapshot
└ `;
    async function ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/f05431ce63c792ae1ff48.jpg');
            return ({
                "ctwaContext": {
                    title: 'Simple WhatsApp Bot',
                    description: `With whatsapp-web.js`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/message'
                }
            });
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        });
    }

    let fake = await ctwa();
    fake.isForwarded = true;
    await client.sendMessage(message.from, r_menu, {
        quotedMessageId: message.id._serialized,
        extra: fake
    });
}
});
