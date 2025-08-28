
const axios = require('axios');

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

module.exports = async function (sock, chatId, message) {
    try {
        const response = await axios.get('https://icanhazdadjoke.com/', {
            headers: { Accept: 'application/json'}
});

        const joke = response.data.joke;

        await sock.sendMessage(chatId, {
            text:
`╭──〔 😂 ᴅᴀᴅ ᴊᴏᴋᴇ ᴏꜰ ᴛʜᴇ ᴅᴀʏ 〕──
│
├─ ${joke}
│
╰──〔 🤖 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error fetching joke:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜱᴏʀʀʏ, ɪ ᴄᴏᴜʟᴅ ɴᴏᴛ ꜰᴇᴛᴄʜ ᴀ ᴊᴏᴋᴇ ʀɪɢʜᴛ ɴᴏᴡ.
│
╰──〔 🤖 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
};
