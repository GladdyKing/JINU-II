
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

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔍 ᴍɪssɪɴɢ sᴏɴɢ ᴛɪᴛʟᴇ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴇɴᴛᴇʀ ᴀ sᴏɴɢ ɴᴀᴍᴇ ᴛᴏ ꜰᴇᴛᴄʜ ʟʏʀɪᴄs.
├─ ᴇxᴀᴍᴘʟᴇ: *.lyrics Shape of You*
│
╰──〔 🎶 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    try {
        const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw await res.text();

        const json = await res.json();

        if (!json.lyrics) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏ ʟʏʀɪᴄs ꜰᴏᴜɴᴅ 〕──
│
├─ ᴄᴏᴜʟᴅɴ'ᴛ ꜰɪɴᴅ ʟʏʀɪᴄs ꜰᴏʀ: *${songTitle}*
│
╰──〔 🎶 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const title = json.title || songTitle;
        const artist = json.author || 'Unknown';
        const lyrics = json.lyrics.split('\n').slice(0, 20).join('\n'); // Show only first 20 lines

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🎵 sᴏɴɢ ʟʏʀɪᴄs 〕──
│
├─ 🎶 *ᴛɪᴛʟᴇ*: ${title}
├─ 🎤 *ᴀʀᴛɪsᴛ*: ${artist}
│
📜 *ʟʏʀɪᴄs*:
${lyrics}
│
╰──〔 🎧 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in lyrics command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ʟʏʀɪᴄs ꜰᴏʀ: *${songTitle}*
│
╰──〔 🎶 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = { lyricsCommand};
