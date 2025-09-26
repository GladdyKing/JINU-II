
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

async function shayariCommand(sock, chatId, message) {
    try {
        const response = await fetch('https://api.shizo.top/api/quote/shayari?apikey=knightbot');
        const data = await response.json();

        if (!data ||!data.result) {
            throw new Error('Invalid response from API');
}

        const buttons = [
            { buttonId: '.shayari', buttonText: { displayText: '🪄 Shayari'}, type: 1},
            { buttonId: '.roseday', buttonText: { displayText: '🌹 RoseDay'}, type: 1}
        ];

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🪄 ᴛᴏᴅᴀʏ's sʜᴀʏᴀʀɪ 〕──
│
├─ ${data.result}
│
╰──〔 💫 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            buttons,
            headerType: 1,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in shayari command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ sʜᴀʏᴀʀɪ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🪄 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = { shayariCommand};
