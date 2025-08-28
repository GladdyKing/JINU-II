
const axios = require('axios');
const mumaker = require('mumaker');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
            serverMessageId: -1
}
}
};

const messageTemplates = {
    error: (message) => ({
        text:
`╭──〔 ❌ ᴇʀʀᴏʀ 〕──
│
├─ ${message}
│
╰──〔 🎨 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}),
    success: (text, imageUrl) => ({
        image: { url: imageUrl},
        caption:
`╭──〔 ✅ ᴛᴇxᴛ ɢᴇɴᴇʀᴀᴛᴇᴅ 〕──
│
├─ *${text}*
│
╰──〔 🎨 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
})
};

async function textmakerCommand(sock, chatId, message, q, type) {
    try {
        if (!q) {
            return await sock.sendMessage(chatId, messageTemplates.error("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ\nᴇxᴀᴍᴘʟᴇ: *.metallic Nick*"), { quoted: message});
}

        const text = q.split(' ').slice(1).join(' ');
        if (!text) {
            return await sock.sendMessage(chatId, messageTemplates.error("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ\nᴇxᴀᴍᴘʟᴇ: *.metallic Nick*"), { quoted: message});
}

        let result;
        const effects = {
            metallic: "https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html",
            ice: "https://en.ephoto360.com/ice-text-effect-online-101.html",
            snow: "https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html",
            impressive: "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html",
            matrix: "https://en.ephoto360.com/matrix-text-effect-154.html",
            light: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
            neon: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
            devil: "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",
            purple: "https://en.ephoto360.com/purple-text-effect-online-100.html",
            thunder: "https://en.ephoto360.com/thunder-text-effect-online-97.html",
            leaves: "https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html",
            '1917': "https://en.ephoto360.com/1917-style-text-effect-523.html",
            arena: "https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html",
            hacker: "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html",
            sand: "https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html",
            blackpink: "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html",
            glitch: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
            fire: "https://en.ephoto360.com/flame-lettering-effect-372.html"
};

        if (!effects[type]) {
            return await sock.sendMessage(chatId, messageTemplates.error("❌ ɪɴᴠᴀʟɪᴅ ᴛᴇxᴛ ᴇꜰꜰᴇᴄᴛ ᴛʏᴘᴇ"), { quoted: message});
}

        result = await mumaker.ephoto(effects[type], text);

        if (!result ||!result.image) {
            throw new Error('No image URL received from the API');
}

        await sock.sendMessage(chatId, messageTemplates.success(text, result.image), { quoted: message});

} catch (error) {
        console.error('❌ Error in textmaker command:', error);
 await sock.sendMessage(chatId, messageTemplates.error(`ᴇʀʀᴏʀ: ${error.message}`), { quoted: message});
}
}

module.exports = textmakerCommand;
