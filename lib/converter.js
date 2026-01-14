
const fs = require('fs');
const path = require('path');
const { spawn} = require('child_process');

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true});
}

      const tmp = path.join(tempDir, Date.now() + '.' + ext);
      const out = tmp + '.' + ext2;

      await fs.promises.writeFile(tmp, buffer);

      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
...args,
        out
      ])
.on('error', reject)
.on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code!== 0) return reject(code);
            const outputBuffer = await fs.promises.readFile(out);
            await fs.promises.unlink(out);
            resolve(outputBuffer);
} catch (e) {
            reject(e);
}
});
} catch (e) {
      reject(e);
}
});
}

/**
 * Convert Audio to Playable WhatsApp Audio (MP3)
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3');
}

/**
 * Convert Audio to Audio Document (alias for toAudio)
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toAudioDoc(buffer, ext) {
  return toAudio(buffer, ext); // same logic, semantic alias
}

/**
 * Convert Audio to WhatsApp PTT (Opus)
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

/**
 * Convert Video to WhatsApp-compatible MP4
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4');
}

module.exports = {
  toAudio,
  toAudioDoc,
  toPTT,
  toVideo,
  ffmpeg
};
