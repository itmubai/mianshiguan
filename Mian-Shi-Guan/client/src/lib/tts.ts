export async function playTTS(text, options = {}) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voiceName: 'x4_lingxiaoqi_cts',
      speed: 50,
      volume: 50,
      pitch: 50,
      ...options
    })
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
} 