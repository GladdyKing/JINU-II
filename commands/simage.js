
const sharp = require('sharp');
const fs = require('fs');
const fsPromises = require('fs/promises');
const fse = require('fs-extra');
const path = require('path');
const { downloadContentFromMessage} = require('@whiskeysockets/baileys');

const tempDir = './temp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

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

const scheduleFileDeletion = (filePath) => {
    setTimeout(async () => {
        try {
            await fse.remove(filePath);
            console.log(`🧹 File deleted: ${filePath}`);
} catch (error) {
            console.error(`❌ Failed to delete file:`, error);
}
}, 5 * 60 * 1000); // 5 minutes
};

const convertStickerToImage = async (sock, quotedMessage, chatId, message) => {
    try {
        const stickerMessage = quotedMessage?.stickerMessage;
        if (!stickerMessage) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏ sᴛɪᴄᴋᴇʀ ᴅᴇᴛᴇᴄᴛᴇᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ sᴛɪᴄᴋᴇʀ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ɪᴛ ᴛᴏ ɪᴍᴀɢᴇ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const stickerFilePath = path.join(tempDir, `sticker_${Date.now()}.webp`);
        const outputImagePath = path.join(tempDir, `converted_${Date.now()}.png`);

        const stream = await downloadContentFromMessage(stickerMessage, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await fsPromises.writeFile(stickerFilePath, buffer);
        await sharp(stickerFilePath).toFormat('png').toFile(outputImagePath);

        const imageBuffer = await fsPromises.readFile(outputImagePath);

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption:
`╭──〔 ✅ sᴛɪᴄᴋᴇʀ ᴄᴏɴᴠᴇʀᴛᴇᴅ 〕──
│
├─ ʜᴇʀᴇ ɪs ʏᴏᴜʀ ɪᴍᴀɢᴇ ᴠᴇʀsɪᴏɴ ᴏꜰ ᴛʜᴇ sᴛɪᴄᴋᴇʀ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

        scheduleFileDeletion(stickerFilePath);
        scheduleFileDeletion(outputImagePath);

} catch (error) {
        console.error('❌ Error converting sticker to image:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴄᴏɴᴠᴇʀsɪᴏɴ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴄᴏɴᴠᴇʀᴛɪɴɢ ᴛʜᴇ sᴛɪᴄᴋᴇʀ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
};

module.exports = convertStickerToImage;
