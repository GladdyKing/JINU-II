
const { ttdl} = require("ruhend-scraper");
const axios = require('axios');

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

async function tiktokCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const url = text?.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴜʀʟ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ʟɪɴᴋ.
│
╰──〔 📲 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                quoted: message
});
            return;
}

        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//,
            /https?:\/\/(?:www\.)?tiktok\.com\/@/,
            /https?:\/\/(?:www\.)?tiktok\.com\/t\//
        ];

        if (!tiktokPatterns.some(p => p.test(url))) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ʟɪɴᴋ 〕──
│
├─ ᴛʜᴀᴛ ɪs ɴᴏᴛ ᴀ ᴠᴀʟɪᴅ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ᴜʀʟ.
│
╰──〔 📲 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                quoted: message
});
            return;
}

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key}
});

        try {
            let downloadData = await ttdl(url);

            if (!downloadData?.data?.length) {
                const apiResponse = await axios.get(`https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`);
                const videoUrl = apiResponse.data?.tiktok?.video;

                if (videoUrl) {
                    await sock.sendMessage(chatId, {
                        video: { url: videoUrl},
                        mimetype: "video/mp4",
                        caption:
`╭──〔 ✅ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ 〕──
│
├─ ꜰʀᴏᴍ ᴛɪᴋᴛᴏᴋ
│
╰──〔 📲 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
                    return;
}
}

            if (!downloadData?.data?.length) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ❌ ɴᴏ ᴍᴇᴅɪᴀ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴛɪᴋᴛᴏᴋ ʟɪɴᴋ.
│
╰──〔 📲 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                    quoted: message
});
                return;
}

            const mediaData = downloadData.data;
            for (let i = 0; i < Math.min(20, mediaData.length); i++) {
                const media = mediaData[i];
                const mediaUrl = media.url;
                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || media.type === 'video';

                const content = isVideo
? { video: { url: mediaUrl}, mimetype: "video/mp4"}
: { image: { url: mediaUrl}};

                await sock.sendMessage(chatId, {
...content,
                    caption:
`╭──〔 ✅ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ 〕──
│
├─ ꜰʀᴏᴍ ᴛɪᴋᴛᴏᴋ
│
╰──〔 📲 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}

} catch (error) {
            console.error('Error in TikTok download:', error);
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ᴄᴏᴜʟᴅ ɴᴏᴛ ꜰᴇᴛᴄʜ ᴛɪᴋᴛᴏᴋ ᴍᴇᴅɪᴀ.
│
╰──〔 📲 ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                quoted: message
});
}

} catch (error) {
        console.error('Error in TikTok command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 📲 ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
            quoted: message
});
}
}

module.exports = tiktokCommand;
