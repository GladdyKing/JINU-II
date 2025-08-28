
const axios = require('axios');
const { sleep} = require('../lib/myfunc');

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

async function pairCommand(sock, chatId, message, q) {
    try {
        if (!q) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔗 ᴘᴀɪʀɪɴɢ ᴄᴏᴍᴍᴀɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴡʜᴀᴛsᴀᴘᴘ ɴᴜᴍʙᴇʀ.
├─ ᴇxᴀᴍᴘʟᴇ: *.pair 263712395XXXX*
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const numbers = q.split(',')
.map(v => v.replace(/[^0-9]/g, ''))
.filter(v => v.length> 5 && v.length < 20);

        if (numbers.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴜsᴇ ᴛʜᴇ ᴄᴏʀʀᴇᴄᴛ ꜰᴏʀᴍᴀᴛ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await sock.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 🚫 ɴᴏᴛ ʀᴇɢɪsᴛᴇʀᴇᴅ 〕──
│
├─ *${number}* ɪs ɴᴏᴛ ʀᴇɢɪsᴛᴇʀᴇᴅ ᴏɴ ᴡʜᴀᴛsᴀᴘᴘ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
                continue;
}

            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⏳ ᴘʀᴏᴄᴇssɪɴɢ 〕──
│
├─ ᴡᴀɪᴛɪɴɢ ꜰᴏʀ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ ꜰᴏʀ *${number}*...
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

            try {
                const response = await axios.get(`https://knight-bot-paircode.onrender.com/code?number=${number}`);

                if (response.data && response.data.code) {
                    const code = response.data.code;

                    if (code === "Service Unavailable") {
                        throw new Error('Service Unavailable');
}

                    await sleep(5000);

                    await sock.sendMessage(chatId, {
                        text:
`╭──〔 🔐 ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ 〕──
│
├─ ꜰᴏʀ *${number}*:
│   *${code}*
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

} else {
                    throw new Error('Invalid response from server');
}

} catch (apiError) {
                console.error('API Error:', apiError);
                const errorMessage = apiError.message === 'Service Unavailable'
? "Service is currently unavailable. Please try again later."
: "Failed to generate pairing code. Please try again later.";

                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ${errorMessage}
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

} catch (error) {
        console.error('❌ General Error:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴜɴᴇxᴘᴇᴄᴛᴇᴅ ᴇʀʀᴏʀ 〕──
│
├─ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = pairCommand;
