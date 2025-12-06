
const isAdmin = require('../lib/isAdmin');

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

async function tagNotAdminCommand(sock, chatId, senderId, message) {
	try {
		const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

		if (!isBotAdmin) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 ⚠️ *ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ* 〕──
│
├─ ᴘʟᴇᴀꜱᴇ ᴍᴀᴋᴇ ᴛʜᴇ ʙᴏᴛ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀꜱᴛ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		if (!isSenderAdmin) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 🔒 *ᴀᴄᴄᴇꜱꜱ ᴅᴇɴɪᴇᴅ* 〕──
│
├─ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴꜱ ᴄᴀɴ ᴜꜱᴇ *.tagnotadmin*
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		const groupMetadata = await sock.groupMetadata(chatId);
		const participants = groupMetadata.participants || [];

		const nonAdmins = participants.filter(p =>!p.admin).map(p => p.id);
		if (nonAdmins.length === 0) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 👥 *ɴᴏ ᴛᴀʀɢᴇᴛꜱ ꜰᴏᴜɴᴅ* 〕──
│
├─ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ ᴀʀᴇ ᴀᴅᴍɪɴꜱ ɪɴ ᴛʜɪꜱ ɢʀᴏᴜᴘ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		let text = '╭──〔 🔊 *ʜᴇʟʟᴏ ɴᴏɴ-ᴀᴅᴍɪɴꜱ* 〕──\n│\n';
		nonAdmins.forEach(jid => {
			text += `├─ @${jid.split('@')[0]}\n`;
		});
		text += '│\n╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──';

		await sock.sendMessage(chatId, { text, mentions: nonAdmins,...channelInfo}, { quoted: message});
	} catch (error) {
		console.error('Error in tagnotadmin command:', error);
		await sock.sendMessage(chatId, {
			text:
`╭──〔 ❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴛᴀɢ ɴᴏɴ-ᴀᴅᴍɪɴ ᴍᴇᴍʙᴇʀꜱ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
			...channelInfo
		}, { quoted: message});
	}
}

module.exports = tagNotAdminCommand;
