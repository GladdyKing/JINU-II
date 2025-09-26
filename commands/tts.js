
const gTTS = require('gtts');
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

async function ttsCommand(sock, chatId, text, message, language = 'en') {
    try {
        if (!text) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴍɪssɪɴɢ ᴛᴇxᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ꜰᴏʀ ᴛᴛs ᴄᴏɴᴠᴇʀsɪᴏɴ.
│   ᴇxᴀᴍᴘʟᴇ: *.tts Hello world*
│
╰──〔 🔊 ᴊɪɴᴜ-ɪɪ ᴛᴛs ᴇɴɢɪɴᴇ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        const fileName = `tts-${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '..', 'assets', fileName);

        const gtts = new gTTS(text, language);
        gtts.save(filePath, async function (err) {
            if (err) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ❌ ᴛᴛs ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴀᴜᴅɪᴏ ꜰʀᴏᴍ ᴛᴇxᴛ.
│
╰──〔 🔊 ᴊɪɴᴜ-ɪɪ ᴛᴛs ᴇɴɢɪɴᴇ 〕──`,
                    quoted: message,
...channelInfo
});
                return;
}

            await sock.sendMessage(chatId, {
                audio: { url: filePath},
                mimetype: 'audio/mpeg',
                caption:
`╭──〔 🔊 ᴛᴇxᴛ ᴛᴏ sᴘᴇᴇᴄʜ 〕──
│
├─ *${text}*
│
╰──〔 🔊 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                quoted: message,
...channelInfo
});

            fs.unlinkSync(filePath);
});

} catch (error) {
        console.error('Error in TTS command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ᴜɴᴀʙʟᴇ ᴛᴏ ᴘʀᴏᴄᴇss ᴛᴛs ʀᴇǫᴜᴇsᴛ.
│
╰──〔 🔊 ᴊɪɴᴜ-ɪɪ ᴛᴛs ᴇɴɢɪɴᴇ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = ttsCommand;
