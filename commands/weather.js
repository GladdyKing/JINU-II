const axios = require('axios');

module.exports = async function (sock, chatId, city) {
    try {
        if (!city) {
            await sock.sendMessage(chatId, {
                text: `╭──〔 ❓ ᴍɪssɪɴɢ ᴄɪᴛʏ 〕──\n│\n├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴄɪᴛʏ ɴᴀᴍᴇ ᴛᴏ ɢᴇᴛ ᴛʜᴇ ᴡᴇᴀᴛʜᴇʀ.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return;
}

        const apiKey = '4902c0f2550f58298ad4146a92b65e10'; // Replace with your OpenWeather API Key
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
);

        const weather = response.data;
        const location = weather.name;
        const description = weather.weather[0].description;
        const temperature = weather.main.temp;
        const feelsLike = weather.main.feels_like;
        const humidity = weather.main.humidity;
        const wind = weather.wind.speed;
        const icon = weather.weather[0].icon;

        const weatherText = `╭──〔 🌦️ ᴡᴇᴀᴛʜᴇʀ ʀᴇᴘᴏʀᴛ 〕──\n│\n├─ 📍 ʟᴏᴄᴀᴛɪᴏɴ: *${location}*\n├─ 🌤️ ᴄᴏɴᴅɪᴛɪᴏɴ: *${description}*\n├─ 🌡️ ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ: *${temperature}°C*\n├─ 🤗 ғᴇᴇʟs ʟɪᴋᴇ: *${feelsLike}°C*\n├─ 💧 ʜᴜᴍɪᴅɪᴛʏ: *${humidity}%*\n├─ 🌬️ ᴡɪɴᴅ sᴘᴇᴇᴅ: *${wind} ᴍ/s*\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        const imageBuffer = (await axios.get(iconUrl, { responseType: 'arraybuffer'})).data;

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: weatherText
});

} catch (error) {
        console.error('❌ Error fetching weather:', error);
        await sock.sendMessage(chatId, {
            text: `╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──\n│\n├─ ᴜɴᴀʙʟᴇ ᴛᴏ ғᴇᴛᴄʜ ᴡᴇᴀᴛʜᴇʀ ғᴏʀ *${city}*.\n├─ ᴘʟᴇᴀsᴇ ᴄʜᴇᴄᴋ ᴛʜᴇ ᴄɪᴛʏ ɴᴀᴍᴇ ᴏʀ ᴛʀʏ ᴀɢᴀɪɴ.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
};
