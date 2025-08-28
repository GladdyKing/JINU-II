
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

async function flirtCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/flirt?apikey=${shizokeys}`);

        if (!res.ok) {
            throw await res.text();
}

        const json = await res.json();
        const flirtMessage = json.result;

        await sock.sendMessage(chatId, {
            text:
`╭──〔 💘 ꜰʟɪʀᴛ ᴍᴏᴅᴇ ᴀᴄᴛɪᴠᴀᴛᴇᴅ 〕──
│
├─ ${flirtMessage}
│
╰──〔 💌 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in flirt command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰʟɪʀᴛ 〕──
│
├─ ᴄᴏᴜʟᴅɴ'ᴛ ꜰᴇᴛᴄʜ ᴀ ꜰʟɪʀᴛ ʟɪɴᴇ ʀɪɢʜᴛ ɴᴏᴡ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 💔 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = { flirtCommand};
