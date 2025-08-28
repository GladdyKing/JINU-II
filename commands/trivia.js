
const axios = require('axios');

let triviaGames = {};

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

async function startTrivia(sock, chatId, message) {
    if (triviaGames[chatId]) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ɢᴀᴍᴇ ᴀʟʀᴇᴀᴅʏ ʀᴜɴɴɪɴɢ 〕──
│
├─ ᴀ ᴛʀɪᴠɪᴀ ɢᴀᴍᴇ ɪs ᴀʟʀᴇᴀᴅʏ ɪɴ ᴘʀᴏɢʀᴇss.
├─ ᴘʟᴇᴀsᴇ ᴀɴsᴡᴇʀ ᴏʀ ᴡᴀɪᴛ ꜰᴏʀ ɪᴛ ᴛᴏ ᴇɴᴅ.
│
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ ᴛʀɪᴠɪᴀ 〕──`,
            quoted: message,
...channelInfo
});
        return;
}

    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const questionData = response.data.results[0];

        triviaGames[chatId] = {
            question: questionData.question,
            correctAnswer: questionData.correct_answer,
            options: [...questionData.incorrect_answers, questionData.correct_answer].sort()
};

        const formattedOptions = triviaGames[chatId].options.map((opt, i) => `│ ${i + 1}. ${opt}`).join('\n');

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🎯 ᴛʀɪᴠɪᴀ ᴛɪᴍᴇ 〕──
│
├─ *${triviaGames[chatId].question}*
│
${formattedOptions}
│
├─ ᴛʏᴘᴇ ʏᴏᴜʀ ᴀɴsᴡᴇʀ ᴇxᴀᴄᴛʟʏ ᴀs ɪᴛ ᴀᴘᴘᴇᴀʀs.
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ ᴛʀɪᴠɪᴀ 〕──`,
            quoted: message,
...channelInfo
});

} catch (error) {
        console.error('Trivia fetch error:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴛʀɪᴠɪᴀ ǫᴜᴇsᴛɪᴏɴ.
│
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ ᴛʀɪᴠɪᴀ 〕──`,
            quoted: message,
...channelInfo
});
}
}

async function answerTrivia(sock, chatId, answer, message) {
    if (!triviaGames[chatId]) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ɴᴏ ɢᴀᴍᴇ ɪɴ ᴘʀᴏɢʀᴇss 〕──
│
├─ sᴛᴀʀᴛ ᴀ ɴᴇᴡ ᴛʀɪᴠɪᴀ ᴡɪᴛʜ *.trivia*
│
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ ᴛʀɪᴠɪᴀ 〕──`,
            quoted: message,
...channelInfo
});
        return;
}

    const game = triviaGames[chatId];
    const correct = game.correctAnswer.toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    const resultText = userAnswer === correct
? `✅ *Correct!* The answer is *${game.correctAnswer}*`
: `❌ *Wrong!* The correct answer was *${game.correctAnswer}*`;

    await sock.sendMessage(chatId, {
        text:
`╭──〔 🧠 ᴛʀɪᴠɪᴀ ʀᴇsᴜʟᴛ 〕──
│
├─ ${resultText}
│
╰──〔 🧠 ᴊɪɴᴜ-ɪɪ ᴛʀɪᴠɪᴀ 〕──`,
        quoted: message,
...channelInfo
});

    delete triviaGames[chatId];
}

module.exports = {
    startTrivia,
    answerTrivia
};
