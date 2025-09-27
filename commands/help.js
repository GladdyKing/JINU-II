
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    // ✅ Extract pushname safely
    const pushname = message.pushName || 'Guest';

    // ✅ Load config and commands (adjust as needed)
    const config = settings;
    const commands = config.COMMANDS || []; // Replace with actual command list if available

    const userInfoBlock = `
╭──〔 👤 ᴜsᴇʀ ᴘʀᴏꜰɪʟᴇ 〕──
│
├─ 👤 ɴᴀᴍᴇ: ${pushname}
├─ 🌐 ᴍᴏᴅᴇ: ${config.MODE || 'Public'}
├─ ✨ ᴘʀᴇғɪx: ${config.PREFIX || '.'}
├─ 📦 ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs: ${commands.length || 'N/A'}
├─ 📌 ᴠᴇʀsɪᴏɴ: ${config.version || '2.0.5'} ʙᴇᴛᴀ
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴇɴᴜ 〕──`;

    const helpMessage = userInfoBlock + `

╭──〔 🌐 ɢᴇɴᴇʀᴀʟ 〕──
│
├─.help
├─.menu
├─.ping
├─.alive
├─.tts <text>
├─.owner
├─.joke
├─.quote
├─.fact
├─.weather <city>
├─.news
├─.attp <text>
├─.lyrics <song_title>
├─.8ball <question>
├─.groupinfo
├─.staff
├─.admins
├─.vv
├─.trt <text> <lang>
├─.ss <link>
├─.jid
│
╰──〔 🌐 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 👮‍♂️ ᴀᴅᴍɪɴ 〕──
│
├─.ban @user
├─.promote @user
├─.demote @user
├─.mute <minutes>
├─.unmute
├─.delete
├─.del
├─.kick @user
├─.warnings @user
├─.warn @user
├─.antilink
├─.antibadword
├─.clear
├─.tag <message>
├─.tagall
├─.chatbot
├─.resetlink
├─.welcome <on/off>
├─.goodbye <on/off>
│
╰──〔 👮‍♂️ ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🔒 ᴏᴡɴᴇʀ 〕──
│
├─.mode
├─.autostatus
├─.clearsession
├─.antidelete
├─.cleartmp
├─.setpp <reply to image>
├─.autoreact
├─.autotyping <on/off>
├─.autoread <on/off>
│
╰──〔 🔒 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🎨 sᴛɪᴄᴋᴇʀ & ɪᴍᴀɢᴇ 〕──
│
├─.blur <image>
├─.simage <reply to sticker>
├─.sticker <reply to image>
├─.tgsticker <link>
├─.meme
├─.take <packname>
├─.emojimix <emoji1>+<emoji2>
│
╰──〔 🎨 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🎮 ɢᴀᴍᴇs 〕──
│
├─.tictactoe @user
├─.hangman
├─.guess <letter>
├─.trivia
├─.answer <answer>
├─.truth
├─.dare
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🤖 ᴀɪ ᴄᴏᴍᴍᴀɴᴅs 〕──
│
├─.gpt <question>
├─.gemini <question>
├─.imagine <prompt>
├─.flux <prompt>
│
╰──〔 🤖 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🎯 ꜰᴜɴ 〕──
│
├─.compliment @user
├─.insult @user
├─.flirt
├─.shayari
├─.goodnight
├─.roseday
├─.character @user
├─.wasted @user
├─.ship @user
├─.simp @user
├─.stupid @user [text]
│
╰──〔 🎯 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 🔤 ᴛᴇxᴛᴍᴀᴋᴇʀ 〕──
│
├─.metallic <text>
├─.ice <text>
├─.snow <text>
├─.impressive <text>
├─.matrix <text>
├─.light <text>
├─.neon <text>
├─.devil <text>
├─.purple <text>
├─.thunder <text>
├─.leaves <text>
├─.1917 <text>
├─.arena <text>
├─.hacker <text>
├─.sand <text>
├─.blackpink <text>
├─.glitch <text>
├─.fire <text>
│
╰──〔 🔤 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 📥 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 〕──
│
├─.play <song_name>
├─.song <song_name>
├─.instagram <link>
├─.facebook <link>
├─.tiktok <link>
├─.video <song name>
├─.ytmp4 <link>
│
╰──〔 📥 ᴊɪɴᴜ-ɪɪ 〕──

╭──〔 💻 ɢɪᴛʜᴜʙ 〕──
│
├─.git
├─.github
├─.sc
├─.script
├─.repo
├─.gitclone
│
╰──〔 💻 ᴊɪɴᴜ-ɪɪ 〕──`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);

            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422020175323@newsletter',
                        newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                        serverMessageId: -1
}
}
}, { quoted: message});
} else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, {
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
newsletterJid: '120363422020175323@newsletter',
                        newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                        serverMessageId: -1
}
}
});
}
} catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage});
}
}

module.exports = helpCommand;
