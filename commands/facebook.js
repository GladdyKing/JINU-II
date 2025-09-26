
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

async function facebookCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 📹 ᴍɪssɪɴɢ ꜰᴀᴄᴇʙᴏᴏᴋ ᴜʀʟ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ ʟɪɴᴋ.
├─ ᴇxᴀᴍᴘʟᴇ: *.fb https://www.facebook.com/...*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        if (!url.includes('facebook.com')) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ʟɪɴᴋ 〕──
│
├─ ᴛʜᴀᴛ ɪs ɴᴏᴛ ᴀ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ ᴜʀʟ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key}
});

        const response = await axios.get(`https://api.dreaded.site/api/facebook?url=${url}`);
        const data = response.data;

        if (!data || data.status!== 200 ||!data.facebook ||!data.facebook.sdVideo) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴀᴘɪ ᴇʀʀᴏʀ 〕──
│
├─ ꜱᴏʀʀʏ, ᴛʜᴇ ᴀᴘɪ ᴅɪᴅɴ'ᴛ ʀᴇsᴘᴏɴᴅ ᴄᴏʀʀᴇᴄᴛʟʏ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const fbvid = data.facebook.sdVideo;

        if (!fbvid) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴠɪᴅᴇᴏ ᴅᴀᴛᴀ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴄʜᴇᴄᴋ ᴛʜᴇ ᴠɪᴅᴇᴏ ʟɪɴᴋ ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true});

        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        const videoResponse = await axios({
            method: 'GET',
            url: fbvid,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Range': 'bytes=0-',
                'Connection': 'keep-alive',
                'Referer': 'https://www.facebook.com/'
}
});

        const writer = fs.createWriteStream(tempFile);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
});

        if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size === 0) {
            throw new Error('Failed to download video');
}

        await sock.sendMessage(chatId, {
            video: { url: tempFile},
            mimetype: "video/mp4",
            caption:
`╭──〔 📥 ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ 〕──
│
├─ ꜱᴏᴜʀᴄᴇ: ꜰᴀᴄᴇʙᴏᴏᴋ.ᴄᴏᴍ
├─ ꜱᴛᴀᴛᴜs: ✅ ᴄᴏᴍᴘʟᴇᴛᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

        try {
            fs.unlinkSync(tempFile);
} catch (err) {
 console.error('Error cleaning up temp file:', err);
}

} catch (error) {
        console.error('❌ Error in Facebook command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴘʀᴏᴄᴇssɪɴɢ ᴛʜᴇ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ.
├─ ᴇʀʀᴏʀ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = facebookCommand;
