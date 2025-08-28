
const axios = require('axios');
const settings = require('../settings'); // Replace with your actual Giphy API key setup

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

async function gifCommand(sock, chatId, query) {
    const apiKey = settings.giphyApiKey;

    if (!query) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔍 ɢɪꜰ ꜱᴇᴀʀᴄʜ ᴍɪssɪɴɢ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ꜱᴇᴀʀᴄʜ ᴛᴇʀᴍ ꜰᴏʀ ᴛʜᴇ ɢɪꜰ.
├─ ᴇxᴀᴍᴘʟᴇ: *.gif dance*
│
╰──〔 🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: query,
                limit: 1,
                rating: 'g'
}
});

        const gifUrl = response.data.data[0]?.images?.downsized_medium?.url;

        if (gifUrl) {
            await sock.sendMessage(chatId, {
                video: { url: gifUrl},
                caption:
`╭──〔 🎞️ ɢɪꜰ ʀᴇsᴜʟᴛ 〕──
│
├─ 🔎 ꜱᴇᴀʀᴄʜ: *${query}*
├─ ✅ ꜰᴏᴜɴᴅ ᴏɴ Giphy
│
╰──〔 🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
} else {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏ ɢɪꜰꜱ ꜰᴏᴜɴᴅ 〕──
│
├─ ɴᴏ ʀᴇsᴜʟᴛs ꜰᴏᴜɴᴅ ꜰᴏʀ: *${query}*
├─ ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴋᴇʏᴡᴏʀᴅ.
│
╰──〔 🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

} catch (error) {
        console.error('❌ Error fetching GIF:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ɢɪꜰ ꜰʀᴏᴍ Giphy.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🎬 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = gifCommand;
