
const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, {
                text:`╭──〔 🎧 ᴍᴜsɪᴄ ʀᴇǫᴜᴇsᴛ 〕──
│
├─ ᴡʜᴀᴛ sᴏɴɢ ᴅᴏ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ?
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return await sock.sendMessage(chatId, {
                reaction: {
                    text: '🎧',
                    key: message.key
}
});
}

        const { videos} = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            await sock.sendMessage(chatId, {
                text:`╭──〔 ❌ ɴᴏ sᴏɴɢs ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴛɪᴛʟᴇ ᴏʀ ᴀʀᴛɪsᴛ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return await sock.sendMessage(chatId, {
                reaction: {
                    text: '❌',
                    key: message.key
}
});
}

        await sock.sendMessage(chatId, {
            text: `╭──〔 ⏳ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴍᴜsɪᴄ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ, ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ɪɴ ᴘʀᴏɢʀᴇss...
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
        await sock.sendMessage(chatId, {
            reaction: {
                text: '⏳',
                key: message.key
}
});

        const video = videos[0];
        const urlYt = video.url;

        const response = await axios.get(`https://yt-dl.officialhectormanuel.workers.dev/?url=${urlYt}`);
        const data = response.data;

        if (!data ||!data.status ||!data.result ||!data.result.downloadUrl) {
            await sock.sendMessage(chatId, {
                text: "Failed to fetch audio from the API. Please try again later."
});
            return await sock.sendMessage(chatId, {
                reaction: {
                    text: '⚠️',
                    key: message.key
}
});
}

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        await sock.sendMessage(chatId, {
            audio: { url: audioUrl},
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
}, { quoted: message});

        await sock.sendMessage(chatId, {
            reaction: {
                text: '✅',
                key: message.key
}
});

} catch (error) {
        console.error('Error in song2 command:', error);
        await sock.sendMessage(chatId, {
            text: "Download failed. Please try again later."
});
        await sock.sendMessage(chatId, {
            reaction: {
                text: '💥',
                key: message.key
}
});
}
}

module.exports = playCommand;
