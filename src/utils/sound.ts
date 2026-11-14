/** A tiny original interface tone, generated locally only after an explicit tap. */
export function playInterfaceTone(volume: number) {
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return false;
  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.setValueAtTime(volume * 0.16, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
  gain.connect(context.destination);
  [660, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    oscillator.connect(gain); oscillator.start(context.currentTime + index * 0.1); oscillator.stop(context.currentTime + 0.4);
  });
  void context.resume().catch(() => undefined);
  setTimeout(() => { void context.close(); }, 600);
  return true;
}
