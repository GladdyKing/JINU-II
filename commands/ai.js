const axios = require('axios');
const fetch = require('node-fetch');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            const menu = `╭──〔 🤖 ᴀɪ ᴄᴏᴍᴍᴀɴᴅ 🤖 〕──\n│\n├─ ❗ ᴇʀʀᴏʀ: ɴᴏ ǫᴜᴇʀʏ ᴘʀᴏᴠɪᴅᴇᴅ\n├─ 💡 ᴜsᴇ: *.ɢᴘᴛ* ᴏʀ *.ɢᴇᴍɪɴɪ* ғᴏʟʟᴏᴡᴇᴅ ʙʏ ʏᴏᴜʀ ǫᴜᴇʀʏ\n│   └─ ᴇxᴀᴍᴘʟᴇ: *.ɢᴘᴛ* ᴡʀɪᴛᴇ ᴀ ʙᴀsɪᴄ ʜᴛᴍʟ ᴄᴏᴅᴇ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
            return await sock.sendMessage(chatId, { text: menu});
}

        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            const menu = `╭──〔 🤖 ᴀɪ ᴄᴏᴍᴍᴀɴᴅ 🤖 〕──\n│\n├─ ❗ ᴇʀʀᴏʀ: ᴍɪssɪɴɢ ǫᴜᴇsᴛɪᴏɴ\n├─ 💬 ᴜsᴇ: *.ɢᴘᴛ* ᴏʀ *.ɢᴇᴍɪɴɪ* ʏᴏᴜʀ_ǫᴜᴇʀʏ_ʜᴇʀᴇ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
            return await sock.sendMessage(chatId, { text: menu});
}

        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key}
});

        if (command === '.gpt') {
            const response = await axios.get(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`);

            if (response.data?.success && response.data.result) {
                const answer = response.data.result.prompt;

                const menu = `╭──〔 🧠 ɢᴘᴛ ʀᴇsᴘᴏɴsᴇ 🧠 〕──\n│\n├─ 📥 ᴘʀᴏᴍᴘᴛ: ${query}\n├─ ✅ sᴛᴀᴛᴜs: ʀᴇsᴘᴏɴsᴇ ʀᴇᴄᴇɪᴠᴇᴅ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

                await sock.sendMessage(chatId, { text: answer}, { quoted: message});
                await sock.sendMessage(chatId, { text: menu});
} else {
                throw new Error('ɪɴᴠᴀʟɪᴅ ʀᴇsᴘᴏɴsᴇ ғʀᴏᴍ ɢᴘᴛ ᴀᴘɪ');
}

} else if (command === '.gemini') {
            const apis = [
                `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
                    `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
                    `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
                    `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
                    `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
                    `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(query)}`
            ];

            for (const api of apis) {
                try {
                    const response = await fetch(api);
                    const data = await response.json();

                    if (data.message || data.data || data.answer || data.result) {
                        const answer = data.message || data.data || data.answer || data.result;

                        const menu = `╭──〔 🌟 ɢᴇᴍɪɴɪ ʀᴇsᴘᴏɴsᴇ 🌟 〕──\n│\n├─ 📥 ᴘʀᴏᴍᴘᴛ: ${query}\n├─ ✅ sᴛᴀᴛᴜs: ʀᴇsᴘᴏɴsᴇ ʀᴇᴄᴇɪᴠᴇᴅ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

                        await sock.sendMessage(chatId, { text: answer}, { quoted: message});
                        await sock.sendMessage(chatId, { text: menu});
                        return;
}
} catch (e) {
                    continue;
}
}

            const menu = `╭──〔 ❌ ɢᴇᴍɪɴɪ ғᴀɪʟᴇᴅ ❌ 〕──\n│\n├─ 🧨 sᴛᴀᴛᴜs: ᴀʟʟ ᴀᴘɪs ғᴀɪʟᴇᴅ\n├─ 🔁 ᴛʀʏ ᴀɢᴀɪɴ: ʟᴀᴛᴇʀ ᴏʀ ᴜsᴇ ᴀ ᴅɪғғᴇʀᴇɴᴛ ǫᴜᴇʀʏ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
            throw new Error('ᴀʟʟ ɢᴇᴍɪɴɪ ᴀᴘɪs ғᴀɪʟᴇᴅ');
}

} catch (error) {
        console.error('AI Command Error:', error);
 const menu = `╭──〔 ❌ ᴀɪ ᴇʀʀᴏʀ ❌ 〕──\n│\n├─ 🧨 sᴛᴀᴛᴜs: sᴏᴍᴇᴛʜɪɴɢ ᴡᴇɴᴛ ᴡʀᴏɴɢ\n├─ 🛠️ ᴛʀʏ ᴀɢᴀɪɴ: ᴘʟᴇᴀsᴇ ʀᴇᴛʀʏ ʟᴀᴛᴇʀ\n│\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
        await sock.sendMessage(chatId, { text: menu});
}
}

module.exports = aiCommand;
