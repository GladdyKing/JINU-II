const { handleAntiBadwordCommand } = require('../lib/antibadword');
const isAdminHelper = require('../lib/isAdmin');

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
  try {
    if (!isSenderAdmin) {
      await sock.sendMessage(chatId, { text: '╭──〔 ⚠️ ᴀᴅᴍɪɴ ᴏɴʟʏ! 〕──\n│ ├─ 👮‍♂️ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ғᴏʀ ᴀᴅᴍɪɴs ᴏɴʟʏ!\n╰──〔 ⚙️ ᴊɪɴᴜ-ɪɪ 〕──' });
      return;
    }

    // Extract match from message
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const match = text.split(' ').slice(1).join(' ');

    await handleAntiBadwordCommand(sock, chatId, message, match);
  } catch (error) {
    console.error('Error in antibadword command:', error);
    await sock.sendMessage(chatId, { text: '╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──\n│ ├─ 🤖 ᴇʀʀᴏʀ ᴘʀᴏᴄᴇssɪɴɢ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ᴄᴏᴍᴍᴀɴᴅ!\n╰──〔 ⚙️ ᴊɪɴᴜ-ɪɪ 〕──' });
  }
}

module.exports = antibadwordCommand;