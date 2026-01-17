const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DEFAULT_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
};

const VIDEO_URL = getArgValue('--url') || process.env.NV_VIDEO_URL || DEFAULT_VIDEO_URL;
const ASSETS_DIR = path.join(__dirname, '../NEUROVA_SITE/assets/video');
const TARGET_FILE = path.join(ASSETS_DIR, 'hero.mp4');

console.log('NEUROVA Video Asset Downloader');
console.log('------------------------------');

if (!fs.existsSync(ASSETS_DIR)) {
  console.log(`Creating directory: ${ASSETS_DIR}`);
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const download = (url, redirectsRemaining = 5) => {
  console.log(`Downloading video from: ${url}`);
  console.log(`Saving to: ${TARGET_FILE}`);

  const urlObj = new URL(url);
  const client = urlObj.protocol === 'http:' ? http : https;

  const request = client.get(
    {
      hostname: urlObj.hostname,
      path: `${urlObj.pathname}${urlObj.search}`,
      protocol: urlObj.protocol,
      headers: {
        'User-Agent': 'Mozilla/5.0 (NEUROVA Asset Downloader)',
        Accept: '*/*',
      },
    },
    (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        if (redirectsRemaining <= 0) {
          console.error('Failed to download: too many redirects.');
          response.resume();
          return;
        }
        const redirectUrl = new URL(response.headers.location, urlObj).toString();
        response.resume();
        download(redirectUrl, redirectsRemaining - 1);
        return;
      }

      if (response.statusCode !== 200) {
        console.error(`Failed to download: HTTP ${response.statusCode}`);
        response.resume();
        return;
      }

      const file = fs.createWriteStream(TARGET_FILE);
      response.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          console.log('Download complete.');
        });
      });

      file.on('error', (err) => {
        fs.unlink(TARGET_FILE, () => {});
        console.error(`Error writing file: ${err.message}`);
      });
    },
  );

  request.on('error', (err) => {
    fs.unlink(TARGET_FILE, () => {});
    console.error(`Error downloading video: ${err.message}`);
  });
};

download(VIDEO_URL);
