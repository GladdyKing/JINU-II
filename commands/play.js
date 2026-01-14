
const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, {
                text: "╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ ᴡʜᴀᴛ sᴏɴɢ ᴅᴏ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ?\n╰───────────────╯"
});
}

        const { videos} = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            await sock.sendMessage(chatId, {
                text: "╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ ɴᴏ sᴏɴɢs ғᴏᴜɴᴅ! 😞\n╰───────────────╯"
});
            return await sock.sendMessage(chatId, {
                react: { text: "❌", key: message.key}
});
}

        await sock.sendMessage(chatId, {
            text: "╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ _ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ, ʏᴏᴜʀ ᴅᴏᴡɴʟᴏᴀᴅ ɪs ɪɴ ᴘʀᴏɢʀᴇss..._ ⏳\n╰───────────────╯"
});

        const video = videos[0];
        const urlYt = video.url;

        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data ||!data.status ||!data.result ||!data.result.downloadUrl) {
            await sock.sendMessage(chatId, {
                text: "╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ ғᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ᴀᴜᴅɪᴏ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ. 😔\n╰───────────────╯"
});
            return await sock.sendMessage(chatId, {
                react: { text: "❌", key: message.key}
});
}

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        await sock.sendMessage(chatId, {
            document: { url: audioUrl},
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: `╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ 🎵 ᴛɪᴛʟᴇ: *${title}*\n│ 💾 ғɪʟᴇ ᴛʏᴘᴇ: ᴀᴜᴅɪᴏ ᴅᴏᴄᴜᴍᴇɴᴛ\n╰───────────────╯`
}, { quoted: message});

        await sock.sendMessage(chatId, {
            react: { text: "✅", key: message.key}
});

} catch (error) {
        console.error('Error in playCommand:', error);
        await sock.sendMessage(chatId, {
            text: "╭─❍ *ᴊɪɴᴜ ᴍᴜsɪᴄ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮\n│ ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ. 😢\n╰───────────────╯"
});
        await sock.sendMessage(chatId, {
            react: { text: "❌", key: message.key}
});
}
}

module.exports = playCommand;
