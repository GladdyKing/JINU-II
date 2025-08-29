
const axios = require('axios');
const { fetchBuffer} = require('../lib/myfunc');

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

async function imagineCommand(sock, chatId, message) {
    try {
        const prompt = message.message?.conversation?.trim() ||
                       message.message?.extendedTextMessage?.text?.trim() || '';

        const imagePrompt = prompt.slice(8).trim();

        if (!imagePrompt) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🎨 ᴍɪssɪɴɢ ᴘʀᴏᴍᴘᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴏᴍᴘᴛ ꜰᴏʀ ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛɪᴏɴ.
├─ ᴇxᴀᴍᴘʟᴇ: *.imagine a futuristic city skyline at night*
│
╰──〔 🖌️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🧠 ᴘʀᴏᴄᴇssɪɴɢ ᴘʀᴏᴍᴘᴛ 〕──
│
├─ ɢᴇɴᴇʀᴀᴛɪɴɢ ʏᴏᴜʀ ɪᴍᴀɢᴇ... ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ.
│
╰──〔 🎨 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

        const enhancedPrompt = enhancePrompt(imagePrompt);

        const response = await axios.get(`https://api.shizo.top/ai/imagine/flux`, {
            params: {
                apikey: 'knightbot',
                prompt: enhancedPrompt
},
            responseType: 'arraybuffer'
});

        const imageBuffer = Buffer.from(response.data);

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption:
`╭──〔 🖼️ ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ 〕──
│
├─ ᴘʀᴏᴍᴘᴛ: *${imagePrompt}*
├─ ᴇɴʜᴀɴᴄᴇᴅ: *${enhancedPrompt}*
│
╰──〔 🎨 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in imagine command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ɪᴍᴀɢᴇ ꜰʀᴏᴍ ᴘʀᴏᴍᴘᴛ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🖌️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

// 🧠 ᴘʀᴏᴍᴘᴛ ᴇɴʜᴀɴᴄᴇʀ
function enhancePrompt(prompt) {
    const qualityEnhancers = [
        'high quality',
        'detailed',
        'masterpiece',
        'best quality',
        'ultra realistic',
        '4k',
        'highly detailed',
        'professional photography',
        'cinematic lighting',
        'sharp focus'
    ];

    const numEnhancers = Math.floor(Math.random() * 2) + 3;
    const selectedEnhancers = qualityEnhancers
.sort(() => Math.random() - 0.5)
.slice(0, numEnhancers);

    return `${prompt}, ${selectedEnhancers.join(', ')}`;
}

module.exports = imagineCommand;
