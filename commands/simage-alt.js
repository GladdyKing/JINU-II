
const { downloadContentFromMessage} = require('@whiskeysockets/baileys');
const { exec} = require('child_process');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

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

async function simageCommand(sock, quotedMessage, chatId, message) {
    try {
        if (!quotedMessage?.stickerMessage) {
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

        const stream = await downloadContentFromMessage(quotedMessage.stickerMessage, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
}

        const tempSticker = `/app/temp/temp_${Date.now()}.webp`;
        const tempOutput = `/app/temp/image_${Date.now()}.png`;

        fs.writeFileSync(tempSticker, buffer);

        await new Promise((resolve, reject) => {
            exec(`${ffmpeg} -i ${tempSticker} ${tempOutput}`, (error) => {
                if (error) reject(error);
                else resolve();
});
});

        await sock.sendMessage(chatId, {
            image: fs.readFileSync(tempOutput),
            caption:
`╭──〔 ✅ sᴛɪᴄᴋᴇʀ ᴄᴏɴᴠᴇʀᴛᴇᴅ 〕──
│
├─ ʜᴇʀᴇ ɪs ʏᴏᴜʀ ɪᴍᴀɢᴇ ᴠᴇʀsɪᴏɴ ᴏꜰ ᴛʜᴇ sᴛɪᴄᴋᴇʀ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});

        fs.unlinkSync(tempSticker);
        fs.unlinkSync(tempOutput);

} catch (error) {
        console.error('❌ Error in simage command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴄᴏɴᴠᴇʀsɪᴏɴ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ sᴛɪᴄᴋᴇʀ ᴛᴏ ɪᴍᴀɢᴇ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = simageCommand;
