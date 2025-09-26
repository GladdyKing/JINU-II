
const fetch = require('node-fetch');
const fs = require('fs');
const { exec} = require('child_process');
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

async function emojimixCommand(sock, chatId, msg) {
    try {
        const text = msg.message?.conversation?.trim() ||
                     msg.message?.extendedTextMessage?.text?.trim() || '';
        const args = text.split(' ').slice(1);

        if (!args[0]) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🎴 ᴇᴍᴏᴊɪᴍɪx ᴜsᴀɢᴇ 〕──
│
├─ ᴇxᴀᴍᴘʟᴇ: *.emojimix 😎+🥰*
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        if (!text.includes('+')) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ✳️ ɪɴᴠᴀʟɪᴅ ꜱʏɴᴛᴀx 〕──
│
├─ sᴇᴘᴀʀᴀᴛᴇ ᴛʜᴇ ᴇᴍᴏᴊɪs ᴡɪᴛʜ ᴀ *+* sɪɢɴ
│
├─ 📌 ᴇxᴀᴍᴘʟᴇ: *.emojimix 😎+🥰*
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        let [emoji1, emoji2] = args[0].split('+').map(e => e.trim());

        const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴇᴍᴏᴊɪs ɴᴏᴛ ᴄᴏᴍᴘᴀᴛɪʙʟᴇ 〕──
│
├─ ᴛʜᴇsᴇ ᴇᴍᴏᴊɪs ᴄᴀɴɴᴏᴛ ʙᴇ ᴍɪxᴇᴅ.
├─ ᴛʀʏ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴄᴏᴍʙɪɴᴀᴛɪᴏɴs.
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const imageUrl = data.results[0].url;
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true});

        const tempFile = path.join(tmpDir, `temp_${Date.now()}.png`).replace(/\\/g, '/');
        const outputFile = path.join(tmpDir, `sticker_${Date.now()}.webp`).replace(/\\/g, '/');

        const imageResponse = await fetch(imageUrl);
        const buffer = await imageResponse.buffer();
        fs.writeFileSync(tempFile, buffer);

        const ffmpegCommand = `ffmpeg -i "${tempFile}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" "${outputFile}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) {
                    console.error('FFmpeg error:', error);
                    reject(error);
} else {
                    resolve();
}
});
});

        if (!fs.existsSync(outputFile)) {
            throw new Error('Failed to create sticker file');
}

        const stickerBuffer = fs.readFileSync(outputFile);

        await sock.sendMessage(chatId, {
            sticker: stickerBuffer
}, { quoted: msg});

        try {
            fs.unlinkSync(tempFile);
            fs.unlinkSync(outputFile);
} catch (err) {
            console.error('Error cleaning up temp files:', err);
}

} catch (error) {
        console.error('Error in emojimix command:', error);
 await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴍɪx ᴇᴍᴏᴊɪs.
├─ ᴍᴀᴋᴇ sᴜʀᴇ ʏᴏᴜ'ʀᴇ ᴜsɪɴɢ ᴠᴀʟɪᴅ ᴇᴍᴏᴊɪs.
│
├─ 📌 ᴇxᴀᴍᴘʟᴇ: *.emojimix 😎+🥰*
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = emojimixCommand;
