import fetch from 'node-fetch';

const APPID = 'd59225a6';
const APIKey = '6766c0fd3a69d84841ea514966f35537';

const API_URLS = {
  age: 'http://tupapi.xfyun.cn/v1/age',
  sex: 'http://tupapi.xfyun.cn/v1/sex',
  expression: 'http://tupapi.xfyun.cn/v1/expression',
  face_score: 'http://tupapi.xfyun.cn/v1/face_score',
};

async function analyzeFace(type: keyof typeof API_URLS, imageBase64: string) {
  const url = API_URLS[type];
  const body = {
    appid: APPID,
    apikey: APIKey,
    image: imageBase64,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Face API error: ' + res.status);
  return res.json();
}

export async function analyzeAllFaceFeatures(imageBase64: string) {
  const [age, sex, expression, face_score] = await Promise.all([
    analyzeFace('age', imageBase64),
    analyzeFace('sex', imageBase64),
    analyzeFace('expression', imageBase64),
    analyzeFace('face_score', imageBase64),
  ]);
  return { age, sex, expression, face_score };
} 