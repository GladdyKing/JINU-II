
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

async function handleSsCommand(sock, chatId, message, match) {
    if (!match) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🖥️ sᴄʀᴇᴇɴsʜᴏᴛ ᴛᴏᴏʟ 〕──
│
├─ ᴜsᴀɢᴇ:
│   *.ss <url>*
│   *.ssweb <url>*
│   *.screenshot <url>*
│
├─ ᴇxᴀᴍᴘʟᴇ:
│.ss https://google.com
│.ssweb https://google.com
│.screenshot https://google.com
│
╰──〔 📸 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);

        const url = match.trim();

        if (!url.startsWith('http://') &&!url.startsWith('https://')) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴜʀʟ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ʟɪɴᴋ sᴛᴀʀᴛɪɴɢ ᴡɪᴛʜ *http://* ᴏʀ *https://*
│
╰──〔 📸 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
        const response = await fetch(apiUrl, { headers: { 'accept': '*/*'}});

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
}

        const imageBuffer = await response.buffer();

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption:
`╭──〔 📸 sᴄʀᴇᴇɴsʜᴏᴛ ᴄᴀᴘᴛᴜʀᴇᴅ 〕──
│
├─ ᴡᴇʙsɪᴛᴇ: ${url}
├─ ᴅᴇᴠɪᴄᴇ: Desktop
├─ ᴛʜᴇᴍᴇ: Light
│
╰──〔 🖥️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in ss command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ sᴄʀᴇᴇɴsʜᴏᴛ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄᴀᴘᴛᴜʀᴇ sᴄʀᴇᴇɴsʜᴏᴛ.
│
├─ ᴘᴏssɪʙʟᴇ ʀᴇᴀsᴏɴs:
│   • ɪɴᴠᴀʟɪᴅ ᴜʀʟ
│   • ᴡᴇʙsɪᴛᴇ ʙʟᴏᴄᴋɪɴɢ sᴄʀᴇᴇɴsʜᴏᴛs
│   • ᴡᴇʙsɪᴛᴇ ɪs ᴅᴏᴡɴ
│   • ᴀᴘɪ sᴇʀᴠɪᴄᴇ ᴛᴇᴍᴘᴏʀᴀʀɪʟʏ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ
│
╰──〔 📸 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = {
    handleSsCommand
};
