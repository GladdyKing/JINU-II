
const { downloadMediaMessage} = require('@whiskeysockets/baileys');
const sharp = require('sharp');

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

async function blurCommand(sock, chatId, message, quotedMessage) {
    try {
        let imageBuffer;

        if (quotedMessage) {
            if (!quotedMessage.imageMessage) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ʀᴇᴘʟʏ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴍᴇssᴀɢᴇ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
                return;
}

            const quoted = {
                message: {
                    imageMessage: quotedMessage.imageMessage
}
};

            imageBuffer = await downloadMediaMessage(quoted, 'buffer', {}, {});
} else if (message.message?.imageMessage) {
            imageBuffer = await downloadMediaMessage(message, 'buffer', {}, {});
} else {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏ ɪᴍᴀɢᴇ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴏʀ sᴇɴᴅ ᴏɴᴇ ᴡɪᴛʜ *.blur*
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const resizedImage = await sharp(imageBuffer)
.resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
})
.jpeg({ quality: 80})
.toBuffer();

        const blurredImage = await sharp(resizedImage)
.blur(10)
.toBuffer();

        await sock.sendMessage(chatId, {
            image: blurredImage,
            caption:
`╭──〔 ✅ ɪᴍᴀɢᴇ ʙʟᴜʀʀᴇᴅ 〕──
│
├─ ʏᴏᴜʀ ɪᴍᴀɢᴇ ʜᴀs ʙᴇᴇɴ sᴍᴏᴏᴛʜʟʏ ʙʟᴜʀʀᴇᴅ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in blur command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ʙʟᴜʀ ɪᴍᴀɢᴇ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🖼️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = blurCommand;
