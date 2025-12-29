


const axios = require('axios');

/**
 * APK Downloader Command
 * Fetches APK details & downloads the file using NexOracle API.
 */
async function apkCommand(sock, chatId, message) {
  try {
    // Extract the user message
    const userMessage =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      '';
    const appName = userMessage.split(' ').slice(1).join(' ');

    if (!appName) {
      await sock.sendMessage(
        chatId,
        { text: '⚠️ Please provide an app name. Example: `.apk whatsapp`' },
        { quoted: message }
      );
      return;
    }

    // React with hourglass while processing
    await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

    // API call to NexOracle
    const apiUrl = 'https://api.nexoracle.com/downloader/apk';
    const params = {
      apikey: 'free_key@maher_apis', // Replace with your API key if needed
      q: appName,
    };

    const response = await axios.get(apiUrl, { params });

    if (!response.data || response.data.status !== 200 || !response.data.result) {
      await sock.sendMessage(
        chatId,
        { text: '❌ Unable to find the APK. Please try again later.' },
        { quoted: message }
      );
      return;
    }

    const { name, lastup, package, size, icon, dllink } = response.data.result;

    // Send thumbnail preview
await sock.sendMessage(
  chatId,
  {
    image: { url: icon },
    caption: `╭──〔 📦 ᴊɪɴᴜ-ɪɪ ᴅᴏᴡɴʟᴏᴀᴅ 〕──
├─ ɴᴀᴍᴇ: *${name}*
├─ ꜱᴛᴀᴛᴜꜱ: ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ... ⏳
╰──〔 😏ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
  },
  { quoted: message }
);
    // Download APK file
    const apkResponse = await axios.get(dllink, { responseType: 'arraybuffer' });
    if (!apkResponse.data) {
      await sock.sendMessage(
        chatId,
        { text: '❌ Failed to download the APK. Please try again later.' },
        { quoted: message }
      );
      return;
    }

    const apkBuffer = Buffer.from(apkResponse.data, 'binary');

    // Format message with details
    const details = `╭──〔 📦ᴊɪɴᴜ-ɪɪ ᴀᴘᴋ ᴅʟ📦 〕──
│
├─📛 ɴᴀᴍᴇ :  ${name}
├─📅 ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ:  ${lastup}
├─📦 ᴘᴀᴄᴋᴀɢᴇ: ${package}
├─⚖️ sɪᴢᴇ: ${size}
│
├─🇿🇼ᴇɴᴊᴏʏ: 
│ʏᴏᴜ ᴄʜᴏsᴇ ᴊɪɴᴜ-ɪɪ ,ᴇɴᴊᴏʏ ᴛʜᴇ ᴠɪʙᴇ😎
│
╰──〔 📦 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──
            
> ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴅᴀᴠɪsᴏɴ ɢʟᴀᴅsᴏɴ`;

    // Send APK as document
    await sock.sendMessage(
      chatId,
      {
        document: apkBuffer,
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${name}.apk`,
        caption: details,
      },
      { quoted: message }
    );

    // Success reaction
    await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

  } catch (error) {
    console.error('❌ Error in apkCommand:', error);

    await sock.sendMessage(
      chatId,
      { text: '❌ Unable to fetch APK details. Please try again later.' },
      { quoted: message }
    );

    // Failure reaction
    await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
  }
}

module.exports = apkCommand;
