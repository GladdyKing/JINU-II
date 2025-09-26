
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

async function truthCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/truth?apikey=${shizokeys}`);

        if (!res.ok) throw await res.text();

        const json = await res.json();
        const truthMessage = json.result;

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🧠 ᴛʀᴜᴛʜ ᴄᴀʀᴅ 〕──
│
├─ ${truthMessage}
│
╰──〔 🧠 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message,
...channelInfo
});

} catch (error) {
        console.error('Error in truth command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴛʀᴜᴛʜ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴀ ᴛʀᴜᴛʜ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = { truthCommand};
