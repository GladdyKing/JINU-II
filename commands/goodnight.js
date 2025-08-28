
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

async function goodnightCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/gnsd?apikey=${shizokeys}`);

        if (!res.ok) {
            throw await res.text();
}

        const json = await res.json();
        const goodnightMessage = json.result;

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🌙 ɢᴏᴏᴅɴɪɢʜᴛ ᴍᴇssᴀɢᴇ 〕──
│
├─ ${goodnightMessage}
│
╰──〔 💤 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in goodnight command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴀ ɢᴏᴏᴅɴɪɢʜᴛ ᴍᴇssᴀɢᴇ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🌌 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = { goodnightCommand};
