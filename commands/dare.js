
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

async function dareCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/dare?apikey=${shizokeys}`);

        if (!res.ok) {
            throw await res.text();
}

        const json = await res.json();
        const dareMessage = json.result;

        // 🎯 sᴇɴᴅ ᴛʜᴇ ᴅᴀʀᴇ
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🎲 ᴅᴀʀᴇ ᴄʜᴀʟʟᴇɴɢᴇ 〕──
│
├─ ${dareMessage}
│
╰──〔 🔥 ᴘʀᴏᴠᴏᴋᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in dare command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴀ ᴅᴀʀᴇ.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 💥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = { dareCommand};
