
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const webp = require('node-webpmux');
const { exec} = require('child_process');
const settings = require('../settings');

const delay = ms => new Promise(res => setTimeout(res, ms));

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

async function stickerTelegramCommand(sock, chatId, msg) {
    try {
        const text = msg.message?.conversation?.trim() || msg.message?.extendedTextMessage?.text?.trim() || '';
        const args = text.split(' ').slice(1);

        if (!args[0]) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴜʀʟ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴛᴇʟᴇɢʀᴀᴍ sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ ᴜʀʟ.
├─ ᴇxᴀᴍᴘʟᴇ: *.tg https://t.me/addstickers/Porcientoreal*
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        if (!args[0].match(/https:\/\/t\.me\/addstickers\//gi)) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴜʀʟ 〕──
│
├─ ᴛʜᴀᴛ ᴅᴏᴇsɴ'ᴛ ʟᴏᴏᴋ ʟɪᴋᴇ ᴀ ᴛᴇʟᴇɢʀᴀᴍ sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const packName = args[0].replace("https://t.me/addstickers/", "");
        const botToken = '7801479976:AAGuPL0a7kXXBYz6XUSR_ll2SR5V_W6oHl4';

        const response = await fetch(`https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(packName)}`);
        const stickerSet = await response.json();

        if (!stickerSet.ok ||!stickerSet.result) {
            throw new Error('Invalid sticker pack or API response');
}

        await sock.sendMessage(chatId, {
            text:
`╭──〔 📦 sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛᴏᴛᴀʟ sᴛɪᴄᴋᴇʀs: *${stickerSet.result.stickers.length}*
├─ ᴘᴀᴄᴋ: *${stickerSet.result.name}*
│
╰──〔 ⏳ ᴄᴏɴᴠᴇʀsɪᴏɴ ɪɴ ᴘʀᴏɢʀᴇss... 〕──`,
...channelInfo
});

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true});

        let successCount = 0;

        for (let i = 0; i < stickerSet.result.stickers.length; i++) {
            try {
                const sticker = stickerSet.result.stickers[i];
                const fileId = sticker.file_id;

                const fileInfo = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
                const fileData = await fileInfo.json();
                if (!fileData.ok ||!fileData.result.file_path) continue;

                const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
                const imageBuffer = await (await fetch(fileUrl)).buffer();

                const tempInput = path.join(tmpDir, `temp_${Date.now()}_${i}`);
                const tempOutput = path.join(tmpDir, `sticker_${Date.now()}_${i}.webp`);
                fs.writeFileSync(tempInput, imageBuffer);

                const isAnimated = sticker.is_animated || sticker.is_video;
                const ffmpegCommand = isAnimated
 ? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
: `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

                await new Promise((resolve, reject) => {
                    exec(ffmpegCommand, (error) => error? reject(error): resolve());
});

                const webpBuffer = fs.readFileSync(tempOutput);
                const img = new webp.Image();
                await img.load(webpBuffer);

                const metadata = {
                    'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                    'sticker-pack-name': settings.packname || 'ᴊɪɴᴜ-ɪɪ',
                    'emojis': sticker.emoji? [sticker.emoji]: ['🤖']
};

                const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
                const jsonBuffer = Buffer.from(JSON.stringify(metadata), 'utf8');
                const exif = Buffer.concat([exifAttr, jsonBuffer]);
                exif.writeUIntLE(jsonBuffer.length, 14, 4);

                img.exif = exif;
                const finalBuffer = await img.save(null);

                await sock.sendMessage(chatId, {
                    sticker: finalBuffer,
...channelInfo
});

                successCount++;
                await delay(1000);

                fs.unlinkSync(tempInput);
                fs.unlinkSync(tempOutput);

} catch (err) {
                console.error(`Error processing sticker ${i}:`, err);
                continue;
}
}

        await sock.sendMessage(chatId, {
            text:
`╭──〔 ✅ ᴄᴏᴍᴘʟᴇᴛᴇᴅ 〕──
│
├─ _${successCount}_ sᴛɪᴄᴋᴇʀs ᴄᴏɴᴠᴇʀᴛᴇᴅ ꜰʀᴏᴍ _${stickerSet.result.name}_
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in stickertelegram command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴄᴏɴᴠᴇʀsɪᴏɴ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ᴛᴇʟᴇɢʀᴀᴍ sᴛɪᴄᴋᴇʀs.
│
├─ ᴄʜᴇᴄᴋ ᴛʜᴇ ꜰᴏʟʟᴏᴡɪɴɢ:
│   • ᴜʀʟ ɪs ᴄᴏʀʀᴇᴄᴛ
│   • sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ ᴇxɪsᴛs
│   • ᴘᴀᴄᴋ ɪs ᴘᴜʙʟɪᴄ
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
}

module.exports = stickerTelegramCommand;
