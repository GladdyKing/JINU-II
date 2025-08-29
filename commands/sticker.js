
const { downloadMediaMessage} = require('@whiskeysockets/baileys');
const { exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const settings = require('../settings');
const webp = require('node-webpmux');
const crypto = require('crypto');

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

async function stickerCommand(sock, chatId, message) {
    const messageToQuote = message;
    let targetMessage = message;

    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quotedInfo = message.message.extendedTextMessage.contextInfo;
        targetMessage = {
            key: {
                remoteJid: chatId,
                id: quotedInfo.stanzaId,
                participant: quotedInfo.participant
},
            message: quotedInfo.quotedMessage
};
}

    const mediaMessage = targetMessage.message?.imageMessage || targetMessage.message?.videoMessage || targetMessage.message?.documentMessage;

    if (!mediaMessage) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ sᴛɪᴄᴋᴇʀ ᴄᴏᴍᴍᴀɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ/ᴠɪᴅᴇᴏ
│   ᴏʀ sᴇɴᴅ ᴍᴇᴅɪᴀ ᴡɪᴛʜ *.sticker* ᴀs ᴄᴀᴘᴛɪᴏɴ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: messageToQuote});
        return;
}

    try {
        const mediaBuffer = await downloadMediaMessage(targetMessage, 'buffer', {}, {
            logger: undefined,
            reuploadRequest: sock.updateMediaMessage
});

        if (!mediaBuffer) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴍᴇᴅɪᴀ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇᴅɪᴀ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true});

        const tempInput = path.join(tmpDir, `temp_${Date.now()}`);
        const tempOutput = path.join(tmpDir, `sticker_${Date.now()}.webp`);
        fs.writeFileSync(tempInput, mediaBuffer);

        const isAnimated = mediaMessage.mimetype?.includes('gif') ||
                           mediaMessage.mimetype?.includes('video') ||
                           mediaMessage.seconds> 0;

        const ffmpegCommand = isAnimated
? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
: `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) reject(error);
                else resolve();
});
});

        const webpBuffer = fs.readFileSync(tempOutput);
        const img = new webp.Image();
        await img.load(webpBuffer);

        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
 'sticker-pack-name': settings.packname || 'ᴊɪɴᴜ-ɪɪ',
            'emojis': ['🤖']
};

        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);

        img.exif = exif;
        const finalBuffer = await img.save(null);

        await sock.sendMessage(chatId, {
            sticker: finalBuffer,
...channelInfo
}, { quoted: messageToQuote});

        try {
            fs.unlinkSync(tempInput);
            fs.unlinkSync(tempOutput);
} catch (err) {
            console.error('🧹 Temp cleanup error:', err);
}

} catch (error) {
        console.error('❌ Error in sticker command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ sᴛɪᴄᴋᴇʀ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʀᴇᴀᴛᴇ sᴛɪᴄᴋᴇʀ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: messageToQuote});
}
}

module.exports = stickerCommand;
