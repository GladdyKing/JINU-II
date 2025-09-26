
const axios = require('axios');

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

module.exports = async function (sock, chatId, message) {
    try {
        const apiKey = 'dcd720a6f1914e2d9dba9790c188c08c'; // Replace with your NewsAPI key
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles.slice(0, 5);

        let newsMessage =
`╭──〔 📰 ʟᴀᴛᴇsᴛ ɴᴇᴡs ʜᴇᴀᴅʟɪɴᴇs 〕──
│`;

        articles.forEach((article, index) => {
            newsMessage += `\n├─ ${index + 1}. *${article.title}*\n│   ${article.description || 'No description'}\n│`;
});

        newsMessage +=
`\n╰──〔 🌐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: newsMessage,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error fetching news:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ɴᴇᴡs ꜰᴇᴛᴄʜ ᴇʀʀᴏʀ 〕──
│
├─ ꜱᴏʀʀʏ, ɪ ᴄᴏᴜʟᴅ ɴᴏᴛ ꜰᴇᴛᴄʜ ᴛʜᴇ ʟᴀᴛᴇsᴛ ɴᴇᴡs.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 📰 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
};
