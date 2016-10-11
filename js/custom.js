

/* ----- VARIABLES ----- */

var vid = document.getElementById("video");
var videoBox = document.getElementById("video-container");
var playButton = document.getElementById("play-pause-btn");
var progressBar = document.getElementById("progress-bar");
var seekBar = document.getElementById("seek-slider");
var bufferAmount = document.getElementById("buffered-amount");
var currentTimeText = document.getElementById("current-time");
var durationTimeText = document.getElementById("duration-time");
var muteButton = document.getElementById("mute");
var textTranscript = document.getElementById("text-transcript");
var volumeBar = document.getElementById("volume-bar");
var fullScreenButton = document.getElementById("full-screen");
var controls = document.getElementById("video-controls");



function initializeVideo() {
  /* Set event listeners */
  playButton.addEventListener("click", playPause, false);
  vid.addEventListener("mouseup", playPause, false);
  seekBar.addEventListener("click", vidSeek, false);
  vid.addEventListener("timeupdate", seekTimeUpdate, false);
  vid.addEventListener("timeupdate", bufferUpdate, false);
  volumeBar.addEventListener("change", volumeControl, false);
  volumeBar.addEventListener("mouseup", volumeControl, false);
  muteButton.addEventListener("click", mute, false);
  fullScreenButton.addEventListener("click", screenSize, false);
}

/* Initialize player on load */
window.onload = initializeVideo;


/* ----- PLAY/PAUSE BUTTONS ----- */
function playPause() {
  if (vid.paused === true) {
    vid.play();
    playButton.innerHTML = "<img src='icons/pause-icon.png' alt='pause'>";
  }
  else {
    vid.pause();
    playButton.innerHTML = "<img src='icons/play-icon.png' alt='play'>";
  }
}

/* ----- VOLUME CONTROLS ----- */
function volumeControl() {
  vid.volume = volumeBar.value;
  if (vid.volume === 0) {
    mute();
  }
  else if (vid.volume > 0) {
    vid.muted = false;
  }
}

function mute() {
  if (vid.muted === false) {
    // Mute video
    vid.muted = true;
    // Update button
    muteButton.innerHTML = "<img src='icons/volume-off-icon.png' alt='volume-off-icon'>";
    // Update volume bar
    volumeBar.value = 0;

  } else {
    // Unmute video
    vid.muted = false;
    // Update button
    muteButton.innerHTML = "<img src='icons/volume-on-icon.png' alt='volume-on-icon'>";
    //Set volume back to previous
    volumeBar.value = vid.volume;
  }
}


/* ----- FULLSCREEN BUTTON ----- */
function screenSize() {
  vid.removeAttribute("controls");
  if (vid.requestFullscreen) {
    videoBox.requestFullscreen();
  } else if (vid.mozRequestFullScreen) {
    vid.mozRequestFullScreen(); // Firefox
  } else if (vid.webkitRequestFullScreen) {
    vid.webkitRequestFullscreen(); // Chrome and Safari
  }
}


/* ----- PROGRESS BAR & TIME DISPLAY ----- */
function vidSeek(event) {
  //Calculate new time based on click
  var seekUpdate = event.offsetX / this.offsetWidth;
  vid.currentTime = seekUpdate * vid.duration;
  seekBar.value = seekUpdate / 100;
}

function seekTimeUpdate() {
  var newTime = vid.currentTime * (100 / vid.duration);
  seekBar.value = newTime;

  // Display current time / duration
  var currentMinutes = Math.floor(vid.currentTime / 60);
  var currentSeconds = Math.floor(vid.currentTime - currentMinutes * 60);

  if (currentSeconds < 10) {
    currentSeconds = "0"+currentSeconds;
  }

  var durationMinutes = Math.floor(vid.duration / 60);
  var durationSeconds = Math.floor(vid.duration - durationMinutes * 60);

  if (durationSeconds < 10) {
    durationSeconds = "0"+durationSeconds;
  }

  currentTimeText.innerHTML = currentMinutes + ":" + currentSeconds;
  durationTimeText.innerHTML = durationMinutes + ":" + durationSeconds;
}

/* ---- BUFFER PROGRESS BAR ----- */

function bufferUpdate() {
  var bufferedEnd = vid.buffered.end(vid.buffered.length - 1);
  var bufferValue = ((bufferedEnd / vid.duration)*100) + "%";

  if (vid.duration > 0) {
    bufferAmount.style.width = bufferValue;
  }
}

    
    
    //JSON for cue start/end times & text
    var syncData = [
          {"start": "0.01","end": "7.535","text": "Now that we've looked at the architecture of the internet, let's see how you might connect your personal devices to the internet inside your house."},
          {"start": "7.536","end": "13.960","text": "Well there are many ways to connect to the internet, and most often people connect wirelessly."},
          {"start": "13.961","end": "17.940","text": "Let's look at an example of how you can connect to the internet."},
          {"start": "17.941","end": "30.920","text": "If you live in a city or a town, you probably have a coaxial cable for cable Internet, or a phone line if you have DSL, running to the outside of your house, that connects you to the Internet Service Provider, or ISP."},
          {"start": "32.100","end": "41.190","text": "If you live far out in the country, you'll more likely have a dish outside your house, connecting you wirelessly to your closest ISP, or you might also use the telephone system."},
          {"start": "42.350","end": "53.760","text": "Whether a wire comes straight from the ISP hookup outside your house, or it travels over radio waves from your roof, the first stop a wire will make once inside your house, is at your modem."},
          {"start": "53.761","end": "57.780","text": "A modem is what connects the internet to your network at home."},
          {"start": "57.781","end": "59.000","text": "A few common residential modems are DSL or..."}            
        ];
        
      //Call function to create transcript on page 
      createTranscript();

       //Reset Video Start Time to start time from matching text & play video
        function textJump(e) {
             video.currentTime = e.target.cue.start;
             video.play();
         }

       //Creates the transcript content on the page using JSON
        function createTranscript() {
            var element;
            for (var i = 0; i < syncData.length; i++) {
                element = document.createElement('span');
                element.cue = syncData[i];
                element.innerText = syncData[i].text + " ";
                textTranscript.appendChild(element);
            }
        }

         //Event listener for text transcript highlight changes
        video.addEventListener("timeupdate", function(e) {
            syncData.forEach(function(element, index, array){
                if( video.currentTime >= element.start && video.currentTime <= element.end )
                    textTranscript.children[index].classList.remove("inactive-cue");
                    textTranscript.children[index].classList.add("active-cue");
                    if (video.currentTime < element.start || video.currentTime > element.end) {
                        textTranscript.children[index].classList.remove("active-cue");
                        textTranscript.children[index].classList.add("inactive-cue");  
                    } 
            });
        });

        //Event listener for text click on transcript
            //When span is clicked
            var sentences = textTranscript.getElementsByTagName('span');
            for (var i = 0; i < sentences.length; i++) {
                sentences[i].addEventListener("click", textJump); //Call textJump function
            }
