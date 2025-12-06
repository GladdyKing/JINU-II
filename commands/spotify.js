
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

async function spotifyCommand(sock, chatId, message) {
    try {
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        const used = (rawText || '').split(/\s+/)[0] || '.spotify';
        const query = rawText.slice(used.length).trim();

        if (!query) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🎧 *ꜱᴘᴏᴛɪꜰʏ ꜱᴇᴀʀᴄʜ* 〕──
│
├─ ᴜꜱᴀɢᴇ: \`${used} <ꜱᴏɴɢ/ᴀʀᴛɪꜱᴛ/ᴋᴇʏᴡᴏʀᴅꜱ>\`
├─ ᴇxᴀᴍᴘʟᴇ: \`${used} ᴄᴏɴ ᴄᴀʟᴍᴀ\`
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const apiUrl = `https://okatsu-rolezapiiz.vercel.app/search/spotify?q=${encodeURIComponent(query)}`;
        const { data} = await axios.get(apiUrl, {
            timeout: 20000,
            headers: { 'user-agent': 'Mozilla/5.0'}
});

        if (!data?.status ||!data?.result) {
            throw new Error('No result from Spotify API');
}

        const r = data.result;
        const audioUrl = r.audio;
        if (!audioUrl) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ *ɴᴏ ᴀᴜᴅɪᴏ ꜰᴏᴜɴᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰɪɴᴅ ᴀ ᴅᴏᴡɴʟᴏᴀᴅᴀʙʟᴇ ᴀᴜᴅɪᴏ ꜰᴏʀ:
│   *${query}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const caption =
`╭──〔 🎶 *ꜱᴘᴏᴛɪꜰʏ ᴛʀᴀᴄᴋ ꜰᴏᴜɴᴅ* 〕──
│
├─ 🎵 *${r.title || r.name || 'ᴜɴᴋɴᴏᴡɴ ᴛɪᴛʟᴇ'}*
├─ 👤 *${r.artist || 'ᴜɴᴋɴᴏᴡɴ ᴀʀᴛɪꜱᴛ'}*
├─ ⏱ *${r.duration || 'ɴ/ᴀ'}*
├─ 🔗 ${r.url || 'ɴᴏ ᴜʀʟ'}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        if (r.thumbnails) {
            await sock.sendMessage(chatId, {
                image: { url: r.thumbnails},
                caption,
...channelInfo
}, { quoted: message});
} else {
            await sock.sendMessage(chatId, {
                text: caption,
...channelInfo
}, { quoted: message});
}

        await sock.sendMessage(chatId, {
            audio: { url: audioUrl},
            mimetype: 'audio/mpeg',
            fileName: `${(r.title || r.name || 'ᴛʀᴀᴄᴋ').replace(/[\\/:*?"<>|]/g, '')}.mp3`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('[SPOTIFY] error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ꜱᴘᴏᴛɪꜰʏ ᴅᴀᴛᴀ.
├─ ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = spotifyCommand;
