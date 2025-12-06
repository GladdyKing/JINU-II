
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

async function soraCommand(sock, chatId, message) {
    try {
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        const used = (rawText || '').split(/\s+/)[0] || '.sora';
        const args = rawText.slice(used.length).trim();
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
        const input = args || quotedText;

        if (!input) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🎥 *ᴛᴇxᴛ ᴛᴏ ᴠɪᴅᴇᴏ ɢᴇɴᴇʀᴀᴛᴏʀ* 〕──
│
├─ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴏᴍᴘᴛ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴀ ᴠɪᴅᴇᴏ.
├─ ᴇxᴀᴍᴘʟᴇ: \`${used} ᴀɴɪᴍᴇ ɢɪʀʟ ᴡɪᴛʜ ꜱʜᴏʀᴛ ʙʟᴜᴇ ʜᴀɪʀ\`
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(input)}`;
        const { data} = await axios.get(apiUrl, {
            timeout: 60000,
            headers: { 'user-agent': 'Mozilla/5.0'}
});

        const videoUrl = data?.videoUrl || data?.result || data?.data?.videoUrl;
        if (!videoUrl) {
            throw new Error('No videoUrl in API response');
}

        await sock.sendMessage(chatId, {
            video: { url: videoUrl},
            mimetype: 'video/mp4',
            caption:
`╭──〔 🎬 *ᴠɪᴅᴇᴏ ɢᴇɴᴇʀᴀᴛᴇᴅ* 〕──
│
├─ 📝 *ᴘʀᴏᴍᴘᴛ:* ${input}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('[SORA] error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴠɪᴅᴇᴏ ꜰʀᴏᴍ ᴘʀᴏᴍᴘᴛ.
├─ ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ ʟᴀᴛᴇʀ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = soraCommand;