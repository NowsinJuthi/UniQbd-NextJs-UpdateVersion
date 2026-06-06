export const playNotificationSound = () => {
  try {
    const audio = new Audio("/ding.mp3");
    audio.volume = 1;

    audio.play().catch((err) => {
      console.log("Audio blocked:", err);
    });
  } catch (err) {
    console.log(err);
  }
};