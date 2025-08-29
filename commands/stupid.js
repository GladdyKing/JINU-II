
const fetch = require('node-fetch');

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

async function stupidCommand(sock, chatId, quotedMsg, mentionedJid, sender, args, message) {
    try {
        let who = quotedMsg
? quotedMsg.sender
: mentionedJid?.[0]
? mentionedJid[0]
: sender;

        let text = args?.length> 0? args.join(' '): 'im+stupid';

        let avatarUrl;
        try {
            avatarUrl = await sock.profilePictureUrl(who, 'image');
} catch (error) {
            console.error('Error fetching profile picture:', error);
            avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
}

        const apiUrl = `https://some-random-api.com/canvas/misc/its-so-stupid?avatar=${encodeURIComponent(avatarUrl)}&dog=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
}

        const imageBuffer = await response.buffer();

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption:
`╭──〔 🧠 sᴛᴜᴘɪᴅ ᴄᴀʀᴅ ɢᴇɴᴇʀᴀᴛᴇᴅ 〕──
│
├─ *ᴛᴀʀɢᴇᴛ:* @${who.split('@')[0]}
├─ *ᴛᴇxᴛ:* ${text.replace(/\+/g, ' ')}
│
╰──〔 🤡 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [who],
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error in stupid command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ sᴛᴜᴘɪᴅ ᴄᴀʀᴅ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🤡 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = { stupidCommand};
