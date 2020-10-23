export const playMatchedSound = () => {
  const audio = document.getElementById('matched-sound') as HTMLAudioElement
  audio.play()
  // new Audio('/sounds/beer1.mp3').play()
}
