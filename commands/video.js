
const axios = require('axios');
const yts = require('yt-search');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
}
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
} catch (err) {
            lastError = err;
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
}
}
}
    throw lastError;
}

async function getYupraVideoByUrl(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
};
}
    throw new Error('Yupra returned no download');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.mp4) {
        return { download: res.data.result.mp4, title: res.data.result.title};
}
    throw new Error('Okatsu ytmp4 returned no mp4');
}

async function videoCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, {
                text: '╭─❍ *ᴊɪɴᴜ ᴠɪᴅᴇᴏ ʙᴏᴛ* ❍─╮\n│ ❓ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠɪᴅᴇᴏ ɴᴀᴍᴇ ᴏʀ ʏᴛ ʟɪɴᴋ.\n╰────────────────╯'
}, { quoted: message});
            return;
}

        let videoUrl = '';
        let videoMeta = null;

        if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
            const ytId = (searchQuery.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
            const { videos} = await yts({ videoId: ytId});
            videoMeta = videos?.[0];
            videoUrl = searchQuery;
} else {
            const { videos} = await yts(searchQuery);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(chatId, {
                    text: '╭─❍ *ᴊɪɴᴜ ᴠɪᴅᴇᴏ ʙᴏᴛ* ❍─╮\n│ ❌ ɴᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ.\n╰────────────────╯'
}, { quoted: message});
                return;
}
            videoMeta = videos[0];
            videoUrl = videoMeta.url;
}

        const { title, author, views, timestamp, thumbnail} = videoMeta || {};
        const thumbUrl = thumbnail || `https://i.ytimg.com/vi/${videoUrl.split('v=')[1]}/sddefault.jpg`;

        // Send waiting message with metadata
        await sock.sendMessage(chatId, {
            image: { url: thumbUrl},
            caption:
`╭─❍ *ᴊɪɴᴜ ᴠɪᴅᴇᴏ ᴅʟ* ❍─╮
│ 🎬 ᴛɪᴛʟᴇ: *${title || 'Unknown'}*
│ 👤 ᴀᴜᴛʜᴏʀ: *${author?.name || 'Unknown'}*
│ 👁️ ᴠɪᴇᴡs: *${views?.toLocaleString() || 'N/A'}*
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: *${timestamp || 'N/A'}*
│ 🔗 ʟɪɴᴋ: ${videoUrl}
│ 🙋‍♂️ ʀᴇQᴜᴇsᴛᴇʀ: @${message.key.participant?.split('@')[0] || 'ᴜɴᴋɴᴏᴡɴ'}
╰────────────────╯
_ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ ᴡʜɪʟᴇ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ..._`
}, { quoted: message});

        // Validate URL
        const valid = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
        if (!valid) {
                    await sock.sendMessage(chatId, {
                text: '╭─❍ _ᴊɪɴᴜ ᴠɪᴅᴇᴏ ʙᴏᴛ_ ❍─╮\n│ ❌ ɪɴᴠᴀʟɪᴅ ʏᴏᴜᴛᴜʙᴇ ʟɪɴᴋ.\n╰────────────────╯'
}, { quoted: message});
            return;
}

        // Try Yupra, fallback to Okatsu
        let videoData;
        try {
            videoData = await getYupraVideoByUrl(videoUrl);
} catch {
            videoData = await getOkatsuVideoByUrl(videoUrl);
}

        // Send video
        await sock.sendMessage(chatId, {
            video: { url: videoData.download},
            mimetype: 'video/mp4',
            fileName: `${videoData.title || title || 'video'}.mp4`,
            caption:
`╭─❍ *ᴊɪɴᴜ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ* ❍─╮
│ 🎬 *${videoData.title || title || 'Video'}*
│ ✅ ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ!
╰────────────────╯
_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ɢʟᴀᴅsᴏɴ_`
}, { quoted: message});

} catch (error) {
        console.error('[VIDEO] Command Error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text: '╭─❍ *ᴊɪɴᴜ ᴠɪᴅᴇᴏ ʙᴏᴛ* ❍─╮\n│ ❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ.\n╰────────────────╯'
}, { quoted: message});
}
}

module.exports = videoCommand;
