
const { igdl} = require("ruhend-scraper");

const processedMessages = new Set();

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

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 📎 ɪɴsᴛᴀɢʀᴀᴍ ʟɪɴᴋ ᴍɪssɪɴɢ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɪɴsᴛᴀɢʀᴀᴍ ᴠɪᴅᴇᴏ ʟɪɴᴋ.
│
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));

        if (!isValidUrl) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ʟɪɴᴋ 〕──
│
├─ ᴛʜᴀᴛ ɪs ɴᴏᴛ ᴀ ᴠᴀʟɪᴅ ɪɴsᴛᴀɢʀᴀᴍ ᴘᴏsᴛ, ʀᴇᴇʟ, ᴏʀ ᴛᴠ ʟɪɴᴋ.
│
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key}
});

        const downloadData = await igdl(text);

        if (!downloadData ||!downloadData.data || downloadData.data.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏ ᴍᴇᴅɪᴀ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛʜᴇʀᴇ ᴡᴀs ɴᴏ ᴍᴇᴅɪᴀ ᴀᴛ ᴛʜᴇ ᴘʀᴏᴠɪᴅᴇᴅ ʟɪɴᴋ.
│
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const mediaData = downloadData.data;
        for (let i = 0; i < Math.min(20, mediaData.length); i++) {
            const media = mediaData[i];
            const mediaUrl = media.url;

            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                            media.type === 'video' ||
                            text.includes('/reel/') ||
                            text.includes('/tv/');

            if (isVideo) {
                await sock.sendMessage(chatId, {
                    video: { url: mediaUrl},
                    mimetype: "video/mp4",
                    caption:
`╭──〔 🎬 ɪɴsᴛᴀ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ 〕──
│
├─ ꜱᴏᴜʀᴄᴇ: ɪɴsᴛᴀɢʀᴀᴍ.ᴄᴏᴍ
├─ ꜱᴛᴀᴛᴜs: ✅ ᴄᴏᴍᴘʟᴇᴛᴇ
│
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
} else {
                await sock.sendMessage(chatId, {
                    image: { url: mediaUrl},
                    caption:
`╭──〔 🖼️ ɪɴsᴛᴀ ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ 〕──
│
├─ ꜱᴏᴜʀᴄᴇ: ɪɴsᴛᴀɢʀᴀᴍ.ᴄᴏᴍ
├─ ꜱᴛᴀᴛᴜs: ✅ ᴄᴏᴍᴘʟᴇᴛᴇ
│
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

} catch (error) {
        console.error('❌ Error in Instagram command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜱᴏᴍᴇᴛʜɪɴɢ ᴡᴇɴᴛ ᴡʀᴏɴɢ ᴡʜɪʟᴇ ᴘʀᴏᴄᴇssɪɴɢ ᴛʜᴇ ʟɪɴᴋ.
[8/22, 16:20] Microsoft Copilot: │
╰──〔 📥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = instagramCommand;
