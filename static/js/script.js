const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.querySelector('#play-btn');
const volumeIcon = document.querySelector('#volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const videoCurrentTime = document.querySelector('.time-elapsed');
const videoDuration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const fileSelector = document.querySelector('#file-selector');
const playbackSpeed = document.querySelector('.player-speed');
const playerContainer = document.querySelector('.player');
let fullscreenStatus = false;

// Play & Pause ----------------------------------- //
function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
    if(fileSelector.files[0]){
        if(video.paused){
            video.play();
            playBtn.classList.replace('fa-play', 'fa-pause');
            playBtn.setAttribute('title', 'Pause');

        } else {
            video.pause();
            playBtn.classList.replace('fa-pause', 'fa-play');
            playBtn.setAttribute('title', 'Play');
        }
    }
    else {
        alert('Please select a video file');
    }
}

// Load Video from file selector
function loadVideo() {
    try {
        video.src = URL.createObjectURL(fileSelector.files[0]);
    } catch (error) {
        video.srcObject = fileSelector.files[0];
    }
    progressBar.style.width = '0%';
    if(fileSelector.files[0]){
        setTimeout(() => {
            videoDuration.textContent = updateTime(video.duration);
        }, 500);
    }
}

//update and return time in minutes and seconds
function updateTime(time) {
    const minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`;
    }

// Progress Bar ---------------------------------- //
    function updateProgressBar() {
    videoCurrentTime.textContent = updateTime(video.currentTime);
    progressBar.style.width = (video.currentTime / video.duration) * 100 + '%';
}


// Volume Controls --------------------------- //
function toggleVolume() {
    volumeIcon.classList = '';
    if(video.muted){
        if (video.volume > 0.7){
            volumeIcon.classList.add('fas', 'fa-volume-up')
        }
        else if(video.volume < 0.7 && video.volume > 0){
            volumeIcon.classList.add('fas', 'fa-volume-down')
        }
        else if ( video.volume === 0){
            volumeIcon.classList.add('fas', 'fa-volume-off')
        }
        volumeIcon.setAttribute('title', 'Mute');
        volumeBar.style.width = video.volume * 100 + '%';
        video.muted = false;
    }
    else{
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
        volumeBar.style.width = '0%';
        video.muted = true;
    }
}

function setVolume(event) {
    video.volume = (event.offsetX/volumeRange.clientWidth);
    volumeBar.style.width = (event.offsetX/volumeRange.clientWidth) * 100 + '%';
    volumeIcon.className = '';
    if (video.volume > 0.7){
        volumeIcon.classList.add('fas', 'fa-volume-up')
    }
    else if(video.volume < 0.7 && video.volume > 0){
        volumeIcon.classList.add('fas', 'fa-volume-down')
    }
    else if ( video.volume === 0){
        volumeIcon.classList.add('fas', 'fa-volume-off')
    }
}

// Fullscreen Mode Implementation
function toggleFullscreen() {
    if(fullscreenStatus){
        //try if exitFullscreen is supported if not then then use prefix webkit for safari browsers
        document.exitFullscreen? document.exitFullscreen() : document.webkitExitFullscreen();
        video.classList.remove('video-fullscreen');
        fullscreenStatus = false;
    }
    else {
        //try if requestFullscreen is supported if not then then use prefix webkit for safari browsers
        playerContainer.requestFullscreen? playerContainer.requestFullscreen() : playerContainer.webkitRequestFullscreen();
        video.classList.add('video-fullscreen');
        fullscreenStatus = true;
    }
}

// Change Playback Speed -------------------- //
playbackSpeed.addEventListener('change',()=>{video.playbackRate = playbackSpeed.value;});

// Change playback Position
progressRange.addEventListener('click', (event) => {video.currentTime = (event.offsetX/progressRange.clientWidth) * video.duration;});


// Fullscreen ------------------------------- //
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Event Listeners
video.addEventListener('ended', showPlayIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgressBar);
playBtn.addEventListener('click', togglePlay);
fileSelector.addEventListener('change', loadVideo);
volumeRange.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', toggleVolume);

// Adding controls to keyboard buttons
window.addEventListener('keydown' ,(event)=>{
    if(event.key === ' '){
        togglePlay();
    }
    else if (event.key === 'ArrowLeft'){
        video.currentTime -= 10;
    }
    else if (event.key === 'ArrowRight'){
        video.currentTime += 10;
    }
});

loadVideo();
