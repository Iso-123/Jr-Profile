const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const playIcon = playBtn.querySelector("i");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");

// Initial settings
audio.volume = 0.5;
audio.loop = true;

// Format seconds into minutes
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Update play/pause icon
function updatePlayIcon() {
    if (audio.paused) {
        playIcon.className = "fa-solid fa-play";
    } else {
        playIcon.className = "fa-solid fa-pause";
    }
}

// Play and pause
playBtn.addEventListener("click", async () => {
    if (audio.paused) {
        try {
            await audio.play();
        } catch (error) {
            console.error("Unable to play music:", error);
        }
    } else {
        audio.pause();
    }

    updatePlayIcon();
});

// Update duration
audio.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(audio.duration);
});

// Update progress while playing
audio.addEventListener("timeupdate", () => {
    currentTimeText.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
});

// Seek music
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Volume control
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// Keep icon synchronized
audio.addEventListener("play", updatePlayIcon);
audio.addEventListener("pause", updatePlayIcon);

// Handle loading errors
audio.addEventListener("error", () => {
    console.error("Music file not found or unsupported.");
});