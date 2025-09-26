
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage} = require('@whiskeysockets/baileys');
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

async function takeCommand(sock, chatId, message, args) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage?.stickerMessage) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɪɴᴠᴀʟɪᴅ ᴜsᴀɢᴇ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ sᴛɪᴄᴋᴇʀ ᴜsɪɴɢ *.take <packname>*
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                quoted: message
});
            return;
}

        const packname = args.join(' ') || 'ᴊɪɴᴜ-ɪɪ';

        try {
            const stickerBuffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: chatId,
                        id: message.message.extendedTextMessage.contextInfo.stanzaId,
                        participant: message.key.participant
},
                    message: quotedMessage
},
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
}
);

            if (!stickerBuffer) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ sᴛɪᴄᴋᴇʀ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                    quoted: message
});
                return;
}

            const img = new webp.Image();
            await img.load(stickerBuffer);

            const json = {
                'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                'sticker-pack-name': packname,
                'emojis': ['🤖']
};

            const exifAttr = Buffer.from([
                0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
                0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x16, 0x00, 0x00, 0x00
            ]);
            const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);

            img.exif = exif;
            const finalBuffer = await img.save(null);

            await sock.sendMessage(chatId, {
                sticker: finalBuffer,
...channelInfo
}, {
                quoted: message
});

} catch (error) {
            console.error('Sticker processing error:', error);
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ sᴛɪᴄᴋᴇʀ ᴇʀʀᴏʀ 〕──
│
├─ ᴇʀʀᴏʀ ᴘʀᴏᴄᴇssɪɴɢ sᴛɪᴄᴋᴇʀ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
                quoted: message
});
}

} catch (error) {
        console.error('Error in take command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴄᴏᴍᴍᴀɴᴅ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ᴇʀʀᴏʀ ᴘʀᴏᴄᴇssɪɴɢ *.take* ᴄᴏᴍᴍᴀɴᴅ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo,
            quoted: message
});
}
}
 module.exports = takeCommand;
