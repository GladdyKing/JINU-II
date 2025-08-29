
const yts = require('yt-search');
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

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, {
                text:
`╭──〔 🎧 ᴍᴜsɪᴄ ʀᴇǫᴜᴇsᴛ 〕──
│
├─ ᴡʜᴀᴛ sᴏɴɢ ᴅᴏ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ?
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

        const { videos} = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏ sᴏɴɢs ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴛɪᴛʟᴇ ᴏʀ ᴀʀᴛɪsᴛ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⏳ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴍᴜsɪᴄ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ, ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ɪɴ ᴘʀᴏɢʀᴇss...
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

        const video = videos[0];
        const urlYt = video.url;

        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data ||!data.status ||!data.result ||!data.result.downloadUrl) {
            return await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴀᴘɪ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴀᴜᴅɪᴏ ꜰʀᴏᴍ ᴛʜᴇ sᴇʀᴠᴇʀ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;
        const duration = video.timestamp;
        const views = video.views.toLocaleString();
        const published = video.ago;
        const author = video.author.name;
        const ytLink = video.url;

        const infoBlock =
`╭──〔 🎉 ᴊɪɴᴜ-ɪɪ sᴏɴɢ ᴅʟ 🎉 〕──
│
├─ 📌 ᴛɪᴛʟᴇ: ${title}.mp3
├─ 😎 ᴀᴜᴛʜᴏʀ: ${author}
├─ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${duration}
├─ 👁️ ᴠɪᴇᴡs: ${views}
├─ 🕒 ᴘᴜʙʟɪsʜᴇᴅ: ${published}
├─ 🔗 ᴜʀʟ: ${ytLink}
│
├─ 🚀 ɢᴇᴛ ɪᴛ ɴᴏᴡ:
│   ᴄʜᴏᴏsᴇ ʏᴏᴜʀ ᴅᴏᴡɴʟᴏᴀᴅ ᴛʏᴘᴇ ʙᴇʟᴏᴡ
│   ᴀɴᴅ ᴇɴᴊᴏʏ ᴛʜᴇ ᴠɪʙᴇ! 😍
│
├─ ⚠️ ɴᴏᴛɪᴄᴇ:
│   ᴜsᴇ ᴡɪsᴇʟʏ, ᴊɪɴᴜ-ɪɪ ɪs ɴᴏᴛ
│   ʀᴇsᴘᴏɴsɪʙʟᴇ ғᴏʀ ᴀɴʏ ɪssᴜᴇs.
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: infoBlock,
...channelInfo
});

        await sock.sendMessage(chatId, {
            audio: { url: audioUrl},
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in play command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
├─ ᴇʀʀᴏʀ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = playCommand;
