
const { downloadContentFromMessage} = require('@whiskeysockets/baileys');
const { exec} = require('child_process');
const fs = require('fs');

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
    try {
        const quotedMsg = message.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ sᴛɪᴄᴋᴇʀ ᴄᴏᴍᴍᴀɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴏʀ ᴠɪᴅᴇᴏ.
│   ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴏɴᴠᴇʀᴛs ᴍᴇᴅɪᴀ ɪɴᴛᴏ sᴛɪᴄᴋᴇʀs.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const type = Object.keys(quotedMsg)[0];
        if (!['imageMessage', 'videoMessage'].includes(type)) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴍᴇᴅɪᴀ 〕──
│
├─ ᴏɴʟʏ *ɪᴍᴀɢᴇs* ᴀɴᴅ *ᴠɪᴅᴇᴏs* ᴀʀᴇ sᴜᴘᴘᴏʀᴛᴇᴅ ꜰᴏʀ sᴛɪᴄᴋᴇʀ ᴄᴏɴᴠᴇʀsɪᴏɴ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const stream = await downloadContentFromMessage(quotedMsg[type], type.split('Message')[0]);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
}

        const tempDir = './temp';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true});

        const tempInput = `${tempDir}/temp_${Date.now()}.${type === 'imageMessage'? 'jpg': 'mp4'}`;
        const tempOutput = `${tempDir}/sticker_${Date.now()}.webp`;

        fs.writeFileSync(tempInput, buffer);

        await new Promise((resolve, reject) => {
            const cmd = type === 'imageMessage'
? `ffmpeg -i "${tempInput}" -vf "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease" "${tempOutput}"`
: `ffmpeg -i "${tempInput}" -vf "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease" -c:v libwebp -preset default -loop 0 -vsync 0 -t 6 "${tempOutput}"`;

            exec(cmd, (error) => {
                if (error) reject(error);
                else resolve();
});
});

        await sock.sendMessage(chatId, {
            sticker: fs.readFileSync(tempOutput),
...channelInfo
}, { quoted: message});

        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);

} catch (error) {
        console.error('❌ Error in sticker command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ sᴛɪᴄᴋᴇʀ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʀᴇᴀᴛᴇ sᴛɪᴄᴋᴇʀ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = stickerCommand;
