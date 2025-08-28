
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
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        const fact = response.data.text;

        await sock.sendMessage(chatId, {
            text:
`╭──〔 📚 ᴜsᴇʟᴇss ꜰᴀᴄᴛ ᴏꜰ ᴛʜᴇ ᴅᴀʏ 〕──
│
├─ ${fact}
│
╰──〔 🤓 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error fetching fact:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜱᴏʀʀʏ, ɪ ᴄᴏᴜʟᴅ ɴᴏᴛ ꜰᴇᴛᴄʜ ᴀ ꜰᴀᴄᴛ ʀɪɢʜᴛ ɴᴏᴡ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🤖 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
};
