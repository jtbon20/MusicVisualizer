/*
  Based on examples from: https://p5js.org/
 */

let mic, soundFile, fft;
const smoothing = 0.8; // play with this, between 0 and .99
const binCount = 1024; // size of resulting FFT array. Must be a power of 2 between 16 an 1024
const particles = new Array(binCount);

function setup() {
  c = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create an Audio input
  mic = new p5.AudioIn();
  mic.start();

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);
}

function draw() {
  background(255);

  // returns an array with [binCount] amplitude readings from lowest to highest frequencies
  const spectrum = fft.analyze(binCount);

  for(var j = 0; j < 5; j++){
    push();
    for(var i = 0; i < 80; i++){
      var thisLevel = map(spectrum[i], 0, 255, -1, 1);
    translate(sin(frameCount * 0.001 + j + thisLevel) * 100, sin(frameCount * 0.001 + j) * 100, i * 0.1);
      rotateZ(frameCount * .002 + thisLevel);
      push();
      sphere(map(spectrum[i], 0, 255, 2, 5));
      //var color = map(spectrum[i], 0, 255, 255, 0);
      //var opacity = map(mic.getLevel(), 0, 1, 0, 255);
      // console.log(mic.getLevel());
      var opacity = map(spectrum[i], 0, 255, .1, 1)
      fill(map(spectrum[i], 0, 255, 250, 3))
      pop();
    }
    pop();
  }
}
// ================
// Helper Functions
// ================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function keyPressed() {
  if (key === 'T') {
    toggleInput();
  }
}

// To prevent feedback, mic doesnt send its output.
// So we need to tell fft to listen to the mic, and then switch back.
function toggleInput() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
    mic.start();
    fft.setInput(mic);
  } else {
    soundFile.play();
    mic.stop();
    fft.setInput(soundFile);
  }
}
