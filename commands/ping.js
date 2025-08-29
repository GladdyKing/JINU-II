
const os = require('os');
const settings = require('../settings.js');

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

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days> 0) time += `${days}d `;
    if (hours> 0) time += `${hours}h `;
    if (minutes> 0) time += `${minutes}m `;
    if (seconds> 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🛰️ ᴘɪɴɢɪɴɢ... 〕──
│
├─ ᴄʜᴇᴄᴋɪɴɢ ʀᴇsᴘᴏɴsᴇ ᴛɪᴍᴇ...
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptimeFormatted = formatTime(process.uptime());

        const botInfo =
`╭──〔 🤖 ʙᴏᴛ sᴛᴀᴛᴜs 〕──
│
├─ 🚀 ᴘɪɴɢ: ${ping} ms
├─ ⏱️ ᴜᴘᴛɪᴍᴇ: ${uptimeFormatted}
├─ 🔖 ᴠᴇʀsɪᴏɴ: v${settings.version}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: botInfo,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in ping command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇᴛ ʙᴏᴛ sᴛᴀᴛᴜs.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = pingCommand;
