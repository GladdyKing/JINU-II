
const fetch = require('node-fetch');

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

async function memeCommand(sock, chatId, message) {
    try {
        const response = await fetch('https://shizoapi.onrender.com/api/memes/cheems?apikey=shizo');
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('image')) {
            const imageBuffer = await response.buffer();

            const buttons = [
                { buttonId: '.meme', buttonText: { displayText: '🎭 Another Meme'}, type: 1},
                { buttonId: '.joke', buttonText: { displayText: '😄 Joke'}, type: 1}
            ];

            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption:
`╭──〔 🐶 ᴄʜᴇᴇᴍs ᴍᴇᴍᴇ 〕──
│
├─ ʜᴇʀᴇ's ʏᴏᴜʀ ᴍᴇᴍᴇ ꜰᴏʀ ᴛʜᴇ ᴅᴀʏ!
│
╰──〔 🎭 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                buttons,
                headerType: 1,
...channelInfo
}, { quoted: message});

} else {
            throw new Error('Invalid response type from API');
}

} catch (error) {
        console.error('❌ Error in meme command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴍᴇᴍᴇ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🐾 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = memeCommand;
