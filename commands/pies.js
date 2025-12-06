
const fetch = require('node-fetch');

const BASE = 'https://shizoapi.onrender.com/api/pies';
const VALID_COUNTRIES = ['china', 'indonesia', 'japan', 'korea', 'hijab'];

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

async function fetchPiesImageBuffer(country) {
  const url = `${BASE}/${country}?apikey=shizo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('image')) throw new Error('API did not return an image');
  return res.buffer();
}

async function piesCommand(sock, chatId, message, args) {
  const sub = (args && args[0] ? args[0] : '').toLowerCase();
  if (!sub) {
    await sock.sendMessage(chatId, {
      text:
`╭──〔 ℹ️ ᴜsᴀɢᴇ 〕──
│
├─ ᴜsᴀɢᴇ: .pies <country>
├─ ᴄᴏᴜɴᴛʀɪᴇs: ${VALID_COUNTRIES.join(', ')}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
    }, { quoted: message });
    return;
  }

  if (!VALID_COUNTRIES.includes(sub)) {
    await sock.sendMessage(chatId, {
      text:
`╭──〔 ❌ ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ 〕──
│
├─ ᴄᴏᴜɴᴛʀʏ: ${sub}
├─ ᴛʀʏ: ${VALID_COUNTRIES.join(', ')}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
    }, { quoted: message });
    return;
  }

  try {
    const imageBuffer = await fetchPiesImageBuffer(sub);
    const caption =
`╭──〔 🍰 ᴘɪᴇs ɪᴍᴀɢᴇ 〕──
│
├─ 🌍 ᴄᴏᴜɴᴛʀʏ: *${sub}*
├─ 🔗 ʀᴇsᴏᴜʀᴄᴇ: ${BASE}/${sub}?apikey=shizo
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
    await sock.sendMessage(chatId, { image: imageBuffer, caption, ...channelInfo }, { quoted: message });
  } catch (err) {
    console.error('❌ Error in pies command:', err);
    await sock.sendMessage(chatId, {
      text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ɪᴍᴀɢᴇ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
    , ...channelInfo }, { quoted: message });
  }
}

async function piesAlias(sock, chatId, message, country) {
  try {
    const imageBuffer = await fetchPiesImageBuffer(country);
    const caption =
`╭──〔 🍰 ᴘɪᴇs ɪᴍᴀɢᴇ 〕──
│
├─ 🌍 ᴄᴏᴜɴᴛʀʏ: *${country}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
    await sock.sendMessage(chatId, { image: imageBuffer, caption, ...channelInfo }, { quoted: message });
  } catch (err) {
    console.error(`❌ Error in pies alias (${country}) command:`, err);
    await sock.sendMessage(chatId, {
      text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ɪᴍᴀɢᴇ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
    , ...channelInfo }, { quoted: message });
  }
}

module.exports = { piesCommand, piesAlias, VALID_COUNTRIES };