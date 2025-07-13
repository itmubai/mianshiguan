import WebSocket from 'ws';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const APPID = 'd59225a6';
const APIKey = 'd5c98789d8b9dcfc2e2a10477fc1b395';
const APISecret = 'NTI0MGMzN2FiZmRhNjQ3ZGJlMGQyMjNl';
const HOST = 'tts-api.xfyun.cn';
const URL = 'wss://tts-api.xfyun.cn/v2/tts';

function getAuthUrl() {
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${HOST}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
  const signatureSha = crypto.createHmac('sha256', APISecret).update(signatureOrigin).digest('base64');
  const authorizationOrigin = `api_key=\"${APIKey}\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"${signatureSha}\"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  const url = `${URL}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${HOST}`;
  return url;
}

export async function synthesizeTTS(text: string, voiceName = 'x4_lingxiaoqi_cts', speed = 50, volume = 50, pitch = 50) {
  return new Promise<Buffer>((resolve, reject) => {
    const wsUrl = getAuthUrl();
    const ws = new WebSocket(wsUrl);
    let audioBuffers: Buffer[] = [];
    ws.on('open', () => {
      const payload = {
        common: { app_id: APPID },
        business: {
          aue: 'lame', // mp3
          auf: 'audio/L16;rate=16000',
          vcn: voiceName,
          speed,
          volume,
          pitch,
          tte: 'UTF8',
          sfl: 1,
        },
        data: {
          status: 2,
          text: Buffer.from(text).toString('base64'),
        },
      };
      ws.send(JSON.stringify(payload));
    });
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.code !== 0) {
        ws.close();
        return reject(new Error(msg.message));
      }
      if (msg.data && msg.data.audio) {
        audioBuffers.push(Buffer.from(msg.data.audio, 'base64'));
      }
      if (msg.data && msg.data.status === 2) {
        ws.close();
        resolve(Buffer.concat(audioBuffers));
      }
    });
    ws.on('error', (err) => {
      reject(err);
    });
    ws.on('close', () => {
      // do nothing
    });
  });
} 